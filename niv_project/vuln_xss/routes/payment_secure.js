var express = require('express');
var router = express.Router();
const {
    getFileContent
} = require("../js/file_reader");

const {
    injectIntoTemplate
} = require("../js/template_loader");



const db = require("../js/db");


router.post('/', async function(req, res) {

    // console.log("body",  req.body);


    let csrfToken = await db.getSyncCSRFToken(req.body.username);
    let myToken = req.body["syncCSRFToken"];

    console.log();
    console.log("correct token", csrfToken);
    console.log("my token     ", myToken)



    if ((myToken === csrfToken )&& (myToken)) {
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

router.get('/', function(req, res) {


    let navbar = injectIntoTemplate(
        getFileContent("./view_components/navbar.html"),
        [
            getFileContent("./view_components/navbar_private_links.html"),
            getFileContent('./view/payment_secure.html')
        ]
    )

    let r = injectIntoTemplate(
        getFileContent("./view_components/base.html"),
        [navbar]
    )

    res.send(r);


    // res.send(`
    //     <form action="/paymentCSRF" method="post">
    //     <input name="csrfToken" value="${csrfToken}" hidden>
    //     <input name="bankNumber" placeholder="bank number">
    //     <input name="amount" placeholder="amount">
    //     <button>pay</button>
    //     </form>

    // `);

});


module.exports = router;
