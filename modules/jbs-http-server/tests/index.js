"use strict!";

import JBS from '../jbs-web-server.js';

// eslint-disable-next-line no-unused-vars
const port = 3001
const app = JBS();
app.setTemplates('./view')
// app.get('/', req => req.res.json(req.res.req.headers));


app.get('/', (req, res)=>{
  const data = {
    title: 'JBS WEB SERVER'
  }
  res.render('index', data);
})

app.listen(3000);