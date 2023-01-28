const express = require('express');
const app = express();
const path = require('path');
const escape = require('escape-html');

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));

var cors = require('cors')
app.use(cors())

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/payment', require('./routes/payment'));
app.use('/paymentSecure', require('./routes/payment_secure'));
app.use('/viewPost', require('./routes/post_view'));
app.use('/createPost', require('./routes/post_create'));


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


app.listen(3000);
console.log("listening on http://localhost:3000");
