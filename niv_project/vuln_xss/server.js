const express = require('express');
const app = express();
// const path = require('path');
// const escape = require('escape-html');

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));

// var cors = require('cors')
// app.use(cors())

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/payment', require('./routes/payment'));
app.use('/paymentSecure', require('./routes/payment_secure'));
app.use('/viewPost', require('./routes/post_view'));
app.use('/createPost', require('./routes/post_create'));
app.use('/trackOrder', require('./routes/order'));

app.listen(3000);
console.log("listening on http://localhost:3000");
