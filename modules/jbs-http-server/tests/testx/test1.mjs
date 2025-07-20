async function main() {
  try {
    const url = "http://localhost:50001/all"
    let f1 = await fetch(url, {
      method: "GET",
      headers: {
        "x-auth": "jbswebserver",
        "accept": 'gambar',
        'accept-language': 'jawa',
        'user-agent': 'browser',
      }
    })
    console.log(f1.headers);
    console.log(await f1.text())

    /*
        const f2 = await fetch(url, {
          "method": "POST",
          headers: {
            "x-auth": "jbs17webserver"
          }
        })
        console.log(f1.headers);
        console.log(await f2.text())
        
        
        f1 = await fetch(url, {
          "method": "PUT"
        })
        console.log(f1.headers);
       // console.log(await f1.text())
        
        
        f1 = await fetch(url, {
          "method": "PATCH"
        })
        console.log(f1.headers);
        console.log(await f1.text())
        
        
        
        f1 = await fetch(url, {
          "method": "DELETE"
        })
        console.log(f1.headers);
        console.log(await f1.text())
        */
  } catch (err) {
    console.error('Error:', err);
  }
}
main()
// setInterval(main, 1000)



























{ [(() => { console.log(0); })][0]() }