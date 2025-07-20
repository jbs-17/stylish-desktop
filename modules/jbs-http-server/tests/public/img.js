import fs from 'fs/promises';
import path from 'path';


const imgDir = './img';
async function main() {
  const images = await fs.readdir(imgDir);
  const length = images.length;
  const no = images.filter(i => {
    const name = path.parse(i).name;
    return !isNaN(name);
  });
  
  for(let i = length-1; i >=0; i-- ){
    const image = `./img/${images[i]}`;
    const ext = path.extname(image)
    const name = `./img/${i}${ext}`
    // console.log({image, name});
    await fs.rename(image, name);
  }
  //console.log(fs);
}
main()