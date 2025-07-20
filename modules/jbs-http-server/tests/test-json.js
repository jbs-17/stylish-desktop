const url1 = 'http://127.0.0.1:3001/json/1';
fetchData1(url1);

async function fetchData1(url){
  try {
    const response = await fetch(url, {
      headers: {
        "content-type": "applicaation/json"
      }
    }
      );
    console.log(response.headers);
    console.log(response.status);
    // const clone = response.clone();
    const data = await response.json();
    console.log({data});
  } catch (error) {
    console.log(error);
  }
}
