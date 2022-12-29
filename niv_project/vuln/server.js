const express = require('express');
const app = express();
const path = require('path');
const sqlite = require("better-sqlite3");
const fs = require("fs");
const db = require("./db");
const escape = require('escape-html');
const crypto = require("crypto");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


function insertRow(content) {
  db.run(
    `INSERT INTO posts (content) VALUES (?)`,
    [content],
    function (error) {
      if (error) {
        console.error(error.message);
      }
    }
  );
}

function insertToken(token, username, sessionToken, form) {

    db.run(
        `INSERT INTO csrf (token, username, sessionToken, form) VALUES (?, ?, ?, ?)`,
        [token, username, sessionToken, form],
        function (error) {
          if (error) {
            console.error(error.message);
          }
        }
      );

    }

function selectRows() {
    var db = new sqlite("./fish.db");
    var rows = db.prepare("SELECT * FROM posts").all();
    return rows;    
}


function authHandler(req, res, next) {


    if (req.sessionToken) {
        next();

    } else {
    res.redirect("/login");        
    }

//   if (req.session.user === undefined) {
//       req.session.err = "Please login to view the requested page."
//       req.session.save(() => {
//           res.redirect('/login');
//       });
//   } else {
//       next();
//   }
}


app.get('/login',  function (req, res, next) {

    res.send("login part")

});


app.get('/signup',  function (req, res, next) {

    fs.readFile('./signup.html', 'utf8', function (err, data) {
        if (err) throw err;
        data += (req.query['something'] || "")
        // res.type('text/plain');
        res.send(data);
      });


    // res.send("login part")

});


app.get('/', authHandler, function (req, res, next) {

    res.send("home page")

});


app.get('/track_order/:id', function(req, res) {




    res.send(
        `

        <script>
    
        sessionStorage.setItem("username", "john");
        sessionStorage.setItem("sessionToken", "123");

        console.log(
            sessionStorage.getItem("username") + "/" + 
            sessionStorage.getItem("sessionToken")
        );

        </script>

        safe: <h1> hello ${escape(req.params.id)} </h1>

        unsafe: <h1> hello ${req.params.id} </h1>

        `

    )

});


app.post('/createPost', function(req, res) {

    insertRow(req.body["post"]);

    res.send(`
        <h1>post published</h1>
        <a href="/createPost">create another</a> 
        <br/>
        <a href="/viewPosts">view posts</a>   
    `);
});


app.get('/createPost', function(req, res) {

    res.send(`

    <h1>create a post</h1>
    <form method="post">
        <label>write a post:
            <input name="post" autocomplete="start typing" />
        </label>
        <button>Sublish</button>
    </form>

    <br/>

    <a href="/viewPosts">view posts</a> 
  
    `);

});


app.get('/viewPosts', function(req, res) {

    let posts = selectRows();

    let postsFormatted = "";

    posts.forEach(element => {
        postsFormatted += '<p  style="background-color:red;">' + element.content + "</p>"


        let e  = escape(element.content)

        postsFormatted += '<p  style="background-color:powderblue;">' + e + "</p>"

    });

    res.send(`

    <h1>view posts</h1>

    ${postsFormatted}
    <br/>
    <a href="/createPost">create a post</a> 
  
    `);

});

app.post('/payment', function(req, res) {

    console.log(req.body);

    res.send(`
        payment ok
    `);
});

app.get('/payment', function(req, res) {

    res.send(`
        <form action="/payment" method="post">
        <input name="bankNumber" placeholder="bank number">
        <input name="amount" placeholder="amount">
        <button>pay</button>
        </form>

    `);
});

let csrfToken = "secure token"

app.post('/paymentCSRF', function(req, res) {

    console.log(req.body);

    if (req.body["csrfToken"] === csrfToken) {
        console.log("csrf token ok");

        res.send(`
            csrf token matched, payment ok
        
        `);
    } else {
    
    // todo obfuscate
        res.send(`
            csrf token mismatch
        `);
        
    }

  
});

app.get('/paymentCSRF', function(req, res) {
    // let token = crypto.randomBytes(64).toString('hex');
    // console.log(token);

    // insertToken(token, username, sessionToken, form)

    res.send(`
        <form action="/paymentCSRF" method="post">
        <input name="csrfToken" value="${csrfToken}" hidden>
        <input name="bankNumber" placeholder="bank number">
        <input name="amount" placeholder="amount">
        <button>pay</button>
        </form>

    `);
});


app.listen(3000);
console.log("listening on 3000")