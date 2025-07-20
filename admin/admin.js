const readline = require('readline');
const fs = require('fs');
const path = require('path')
const { } = require('./userdatabase.js');;




const userdatabase = path.resolve(`C:/Users/HEWLETT-PACKARD/Desktop/proyek1-Stylish-Desktop/database/userdatabase.json`);
//cek data berubah
let cekC = 0
const cek = fs.watch(userdatabase, (eventType, filename) => {
  if (cekC < 2) {
    cekC++
  } else {
    setTimeout(() => {
      console.log('\nData berubah:')
      console.table(list())
      cekC = 0
    }, 1000)
  }
})


cek.on('error', (e) => {
  console.log(e)
})




//interfacenya
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//baca input line
rl.on('line', (input) => {
  input = input.trim().split(' ').filter(i => {
    if (i != ' ') {
      return i
    }
  });
  let params = input.slice(1);
  if (!params.length) {
    params = []
  }
  const cmd = input[0];
  console.log(`\ncmd: ${cmd}, params: ${params}`)
  verifyCMD(cmd, params)
})



//list cmd
const cmds = ['add', 'remove', 'list', 'verify', 'removebi', 'cmds', 'help', 'exit']

//verif cmd
function verifyCMD(cmd, params) {
  if (!cmds.includes(cmd)) {
    console.log(`cmd '${cmd}' tidak ada\n`);
    return
  }
  if (cmds.includes(cmd));
  switch (cmd) {
    case 'cmds':
      console.log(cmds)
      break
    case 'help':
      console.log(cmds)
      break
    case 'list':
      break
    case 'add':
      break
    case 'remove':
      break
    case 'removebi':
      break
    case 'verify':
      break
    case 'rename':
      break
    case 'exit':
      console.log('CLI admin berhenti')
      console.log(exit)
      rl.close()
    default:
      console.log(`cmd '${cmd}' error\n`);
  }
  return
}


