import JBS from 'jbs-http-server';
const root = JBS.Router();


root.get('/landing', (req, res)=>{
  res.html('./public/page/landing.html');
});
root.get('/home', (req, res)=>{
  res.html('./public/page/home.html');
})
root.get('/register', (req, res)=>{
  res.html('./public/page/register.html');
})
root.get('/login', (req, res)=>{
  res.html('./public/page/login.html');
})
root.get('/upload', (req, res)=>{
  res.html('./public/page/upload.html');
});





export default root;