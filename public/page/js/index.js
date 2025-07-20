console.log('JBS');

(async ()=>{
  const f = await fetch('http://10.3.102.121:3000')
  const g = await f.text()
  console.log(g)
}
)()