import jsonfile from 'jsonfile';
import {promisify} from 'util';


//import {userdatabase} from '../config.js';



const userDatabase = './userdatabase.json';

const readFileJSON = promisify(jsonfile.readFile);
const writeFileJSON = promisify(jsonfile.writeFile);
async function readUserDatabase() {
  try {
    return await readFileJSON(userDatabase);
  } catch (err) {
    console.error('Error:', err);
    return null
  }
}


async function indexing() {
  try {
    const users = await readUserDatabase();
    const indexedUsers = users.map((user, i) => {
      user["index"] = i;
      return user
    });
    return indexedUsers
  } catch (err) {
    console.error('Error:', err);
    
  }
}

console.log(await indexing())

async function UUIDS() {
  const users = await readUserDatabase();
  if(!users){
    return null
  }
  return users.map((user, i) => {
  return {index: i ,user: user.UUID};
});
}

async function usernames() {
  const users = await readUserDatabase();
  if(!users){
    return null
  }
  return users.map((user, i) => {
  return {index: i ,user: user.username};
});
}

async function searchUser(str = '') {
  try {
    const users = await readUserDatabase();
  if(!users){
    return null
  }
  const user = users.filter((user, i) => {
    return user.username.includes(str);
  });
  return user
}catch (err) {
    return err
  }
}



//console.log(await searchUser('ad'));