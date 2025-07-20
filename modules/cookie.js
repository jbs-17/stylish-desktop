// const a = new Date().toUTCString()
const expires = () => { return new Date(new Date().setUTCDate(new Date().getDate() + 7)).toUTCString() }

const crypto = require('crypto');
function hash(str) {
    return crypto.hash('sha256', str);
}

function setCookie(username, password) {
    return `"sesi"={ "${hash("passwordHASH")}":"${hash(password)}", "${hash("usernameHASH")}":"${hash(username)}","username":"${username}"}; path=/; expires=${expires()}`
};


// console.log(hash('admin'))
const http = require('http');
http.createServer((req, res) => {
    res.setHeader('Set-Cookie', `${setCookie('admin', 'admin1234')}`);
    res.writeHead(200, { "content-type": "text/html" })
    res.write(`
    <form action="https://localhost:3000/verify" method="post">
        <h2>Login</h2>
        <label for="username">Username:</label>
        <input type="text" id="username" name="u" required><br><br>

        <label for="password">Password:</label>
        <input type="password" id="password" name="p" required><br><br>

        <button type="submit">Login</button>
    </form>
    `)
    res.write(`<script>
        const a = JSON.parse(document.cookie.split('=')[1])
        console.log(a)
        const u = document.querySelector("input[type='text']") 
        const p = document.querySelector("input[type='password']") 
        u.value = a["c0a4ffe2bd64da07309feddc772c31344d1150d36d6b33338cc54a53188751a2"]
        p.value = a["1d3175b6074e8fd7b4ef957daf4f5344232c337ecd02a407eef7dd72a3e183e4"]
        </script>`)
    res.end()
})
    .listen(1000)

// console.log(hash("passwordHASH")); //1d3175b6074e8fd7b4ef957daf4f5344232c337ecd02a407eef7dd72a3e183e4
// console.log(hash("usernameHASH")); //c0a4ffe2bd64da07309feddc772c31344d1150d36d6b33338cc54a53188751a2

/*
1d3175b6074e8fd7b4ef957daf4f5344232c337ecd02a407eef7dd72a3e183e4 : "ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270"
c0a4ffe2bd64da07309feddc772c31344d1150d36d6b33338cc54a53188751a2 : "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"
*/

//    res.setHeader('Set-Cookie', 'myCookie=myValue; path=/; expires=Sat, 30 May 2025 12:00:00 GMT');