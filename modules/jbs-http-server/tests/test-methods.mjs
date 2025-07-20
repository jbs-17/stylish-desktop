try {
  const url = "http://localhost:3001/api/1";
  let f1 = await fetch(url, {
    method: "GET"
  })
  console.log(await f1.text())
  
  
  const f2 = await fetch(url, {
    "method": "POST"
  })
  console.log(await f2.text())
  
  
  f1 = await fetch(url, {
    "method": "PUT"
  })
  console.log(await f1.text())
  
  
  f1 = await fetch(url, {
    "method": "PATCH"
  })
  console.log(await f1.text())
  
  
  
  f1 = await fetch(url, {
    "method": "DELETE"
  })
  console.log(await f1.text())



  f1 = await fetch(url, {
    "method": "OPTIONS"
  })
  console.log(await f1.text())
} catch (err) {
  console.error('Error:', err);
  
}