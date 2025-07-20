import crypto from 'node:crypto';

export {hash, randomUUID};
export default {
  hash, randomUUID
}

function hash(string = '') {
  try {
    if (typeof (string) != "string") { throw undefined }
    const hash = crypto.createHash('sha256');
    hash.update(string);
    return hash.digest('hex');
  } catch (e) {
    return e
  }
}
function randomUUID(){
  try{
    return crypto.randomUUID()
  }catch(e){
    return e
  }
}

// console.log(hash("admin"))



/*
const input = 'halo';
const hash = crypto.createHash('sha256');
hash.update(input);
const hashValue = hash.digest('hex');

console.log(`Input: ${input}`);
console.log(`Hash: ${hashValue}`);
*/
