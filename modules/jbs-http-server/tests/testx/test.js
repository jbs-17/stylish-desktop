
try {
  const ambil1 = await fetch('http://localhost:9999/tes', {
    "method": "GET"
  });
  const data1 = await ambil1.headers;

  const ambil2 = await fetch('http://localhost:9999/tes', {
    "method": "POST"
  });
  const data2 = await ambil2.headers;

  const ambil3 = await fetch('http://localhost:9999/tes', {
    "method": "PUT"
  });
  const data3 = await ambil3.headers;

  const ambil4 = await fetch('http://localhost:9999/tes', {
    "method": "PATCH"
  });
  const data4 = await ambil4.headers;

  const ambil5 = await fetch('http://localhost:9999/tes', {
    "method": "DELETE"
  });
  const data5 = await ambil5.headers;
  
  // apacoba
  const ambil6 = await fetch('http://localhost:9999/tes', {
    "method": "HEAD"
  });
  const data6 = ambil6.headers;

  const ambil7 = await fetch('http://localhost:9999/tes', {
    "method": "OPTIONS"
  });
  const data7 = await ambil7.headers;
  
  // const ambil8 = await fetch('http://localhost:9999/tes', {
  //   "method": "CONNECT"
  // });
  // const data8 = await ambil8.text();

  // const ambil9 = await fetch('http://localhost:9999/tes', {
  //   "method": "TRACE"
  // });
  // const data9 = await ambil9.text();
  console.log({data1, data2,data3, data4, data5, data6, data7});
} catch (error) {
  console.log(error); 
}