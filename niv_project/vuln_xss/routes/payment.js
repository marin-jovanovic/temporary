var express = require('express');
var router = express.Router();
const {
    getFileContent
} = require("../js/file_reader");

const {
    injectIntoTemplate
} = require("../js/template_loader");


router.get('/', function(req, res) {


    let navbar = injectIntoTemplate(
        getFileContent("./view_components/navbar.html"),
        [
            getFileContent("./view_components/navbar_private_links.html"),
            getFileContent('./view/payment.html')
        ]
    )

    let r = injectIntoTemplate(
        getFileContent("./view_components/base.html"),
        [navbar]
    )

    res.send(r);

});

router.post('/', function(req, res) {

    console.log(req.body);

    let navbar = injectIntoTemplate(
        getFileContent("./view_components/navbar.html"),
        [
            getFileContent("./view_components/navbar_private_links.html"),
            `payment done! bank number = ${req.body.bankNumber}, amount = ${req.body.amount}`
        ]
    )

    let r = injectIntoTemplate(
        getFileContent("./view_components/base.html"),
        [navbar]
    )

    res.send(r);


    // res.send(`
    //     payment ok
    // `);
});

module.exports = router;
