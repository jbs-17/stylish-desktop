import path from 'path';
import fsx from 'fs-extra';



export default function SearchFileSync(pathdir, file, options) {
  try {
    if(!fsx.existsSync(pathdir)){
      throw Error(`pathdirectory '${pathdir}' doesnot exists`)
    }
    const filepathparse = path.parse(file);
      
    let dirs = [];
    let files = [];
    let ditemukan = [];
    fsx.readdirSync(pathdir).forEach(path => {
      path = `${pathdir}/${path}`
      if (fsx.statSync(path).isDirectory()) {
        if(!path.includes('Android'))
        dirs.push(path)
      } else {
        if (path.includes(file)) {
          ditemukan.push(path)
        } else {
          files.push(path)}
      }
    })
    
    while (dirs.length) {
      dirs.forEach((dir,i) => {
        //console.log(dir)
        fsx.readdirSync(dir)
        .forEach(path => {
          path = `${dir}/${path}`
          if(fsx.statSync(path).isDirectory()){
            dirs.push(path)
          }else{
            if(path.includes(file)){
              ditemukan.push(path)
            }else{
              files.push(path)
            }
          }
        })
        dirs.splice(dirs.indexOf(dir), 1)
      })
    }
    return ditemukan
  }
  catch(e) {
    return e
  }
}




/*
file = 'iniyangsayacari.txt'
let dir = '/storage/emulated/0/'
console.log(carifiledidir(dir, file))
*/
