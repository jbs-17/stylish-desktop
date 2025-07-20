const fsx = require('fs-extra');
const path = require('path');
const fs = require('fs');

module.exports = {
  searchFilesSync
};
function searchFilesSync(pathdir, file, options = { firstFounded: false, exceptNodeModule: true }) {
  try {
    if (!fs.existsSync(pathdir)) {
      throw { message: `pathdirectory '${pathdir}' doesnot exists` }
    }
    const filepathparse = path.parse(file);
    let dirs = [];
    let files = [];
    let ditemukan = [];
    fsx.readdirSync(pathdir).forEach(pathx => {
      pathx = path.resolve(`${pathdir}/${pathx}`)
      // console.log(pathx)
      if (fsx.statSync(pathx).isDirectory()) {
        if (!pathx.includes('Android')) {
          if (options.exceptNodeModule) { if (!pathx.includes('module')) { dirs.push(pathx) } } else { dirs.push(pathx) }
        }
      } else {
        if (pathx.includes(file)) {
          ditemukan.push(pathx)
        } else {
          files.push(pathx)
        }
      }
    })

    while (dirs.length) {
      dirs.forEach((dirx, i) => {
        //console.log(dir)
        fsx.readdirSync(dirx)
          .forEach(pathx => {
            pathx = path.resolve(`${dirx}/${pathx}`);
            if (fsx.statSync(pathx).isDirectory()) {
              if (options.exceptNodeModule) {
                if (!dirx.includes('module')) {
                  dirs.push(pathx)
                }
              } else {
                dirs.push(pathx)
              }
            } else {
              if (pathx.includes(file)) {
                ditemukan.push(pathx)
              } else {
                files.push(pathx)
              }
            }
          })
        dirs.splice(dirs.indexOf(dirx), 1)
      })
    }
    // console.log('ditemukan',ditemukan)
    if (options.firstFounded) {
      return ditemukan.map(p => path.resolve(p))[0];
    } else {
      return ditemukan.map(p => path.resolve(p));
    }
  }
  catch (e) {
    console.log('SearchFileSync error!')
    console.log(e.message)
    return null
  }
}

// console.log(searchFileSync('C:\\Users\\HEWLETT-PACKARD\\Desktop\\proyek1-Stylish-Desktop', 'html', {firstFounded: true}))