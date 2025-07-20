
const url = 'http://localhost:3000/r1/x';
async function main(m) {
  try {
    const response = await fetch(url, {
      method: m
    });
    const data = await response.text();
    console.log({headers: response.headers, data});
  }
  catch (err) {
    console.error('Error:', err);
  }
}
main('GET')
main('POST')
main('PUT')
main('PATCH')
main('DELETE')
main('OPTIONS')