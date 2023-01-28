const express = require('express');
const app = express();
const path = require('path');
const db = require("./js/db");
const escape = require('escape-html');
// const fs = require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));
var cors = require('cors')
app.use(cors())



const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);


// app.use('/admin', adminRouter);
// app.use('/user', userRouter);
// app.use('/company', companyRouter);


// app.get('/login', function(req, res, next) {

//     res.send("login part")

// });






app.get('/track_order/:id', function(req, res) {

// reflected

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

    let posts = db.selectRows();

    let postsFormatted = "";

    posts.forEach(element => {
        postsFormatted += '<p  style="background-color:red;">' + element.content + "</p>"


        let e = escape(element.content)

        postsFormatted += '<p  style="background-color:powderblue;">' + e + "</p>"

    });

    res.send(`

    <h1>view posts</h1>

    ${postsFormatted}
    <br/>
    <a href="/createPost">create a post</a> 
  
    `);

});

app.get("/tmp", function(req, res) {


    res.json({"sync token": "123"});
});

app.post('/payment', function(req, res) {

    console.log(req.body);

    res.send(`
        payment ok
    `);
});

app.get('/payment', function(req, res) {

    res.send(`

        for each user for each session we can have 

        without token
        <form action="/payment" method="post">
        <input name="bankNumber" placeholder="bank number">
        <input name="amount" placeholder="amount">
        <button>pay</button>
        </form>

        <br/>

        with token
        <form action="/payment" method="post">
        <input name="token" placeholder="token123">
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
console.log("listening on http://localhost:3000");

// (async () => {

//    await db.addUser("user1", "pass1");
//    console  .log();
// await    db.login("user1", "pass1");
    

// })();



