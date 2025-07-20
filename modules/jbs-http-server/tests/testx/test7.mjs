import fs from 'fs/promises';


const url = '127.0.0.1:50001/';
async function main() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: `);
    }
    const data = await response.json();
  }
  catch (err) {
    console.error('Error:', err);
  }
}
