const {
    authHandler
} = require("../js/middleware");
var express = require('express');
const {
    route
} = require(".");
var router = express.Router();

const {
    getHomeView
} = require("./homeView")

const {
    getFileContent
} = require("../js/file_reader");

const {
    injectIntoTemplate
} = require("../js/template_loader");

const db = require("../js/db");





router.get('/signup', function(req, res, next) {

    let navbar = injectIntoTemplate(
        getFileContent("./view_components/navbar.html"),
        [
            getFileContent("./view_components/navbar_public_links.html"),
            getFileContent('./view/signup.html')
        ]
    )

    let r = injectIntoTemplate(
        getFileContent("./view_components/base.html"),
        [navbar]
    )

    res.send(r);


});


router.post('/signup',
    async function(req, res, next) {

            let isLoggedIn = await db.addUser(req.body.username, req.body.password);

            if (!isLoggedIn) {

                res.send(`
            username already exists
        `)

                return
            }

            next();
            // res.redirect("/");

        },
        getHomeView
);

router.get('/login', function(req, res, next) {

    let navbar = injectIntoTemplate(
        getFileContent("./view_components/navbar.html"),
        [
            getFileContent("./view_components/navbar_public_links.html"),
            getFileContent('./view/login.html')
        ]
    )

    let r = injectIntoTemplate(
        getFileContent("./view_components/base.html"),
        [navbar]
    )

    res.send(r);



});

router.post('/login',
    async function(req, res, next) {

            //    status : true,
            // sessionToken: sessionToken,
            // syncCSRFToken: syncCSRFToken,


            let authObj = await db.login(req.body.username, req.body.password);

            if (authObj.status) {
                console.log("logged in")
                console.log(authObj)

            } else {
                console.log("wrong credentials")

                res.send("username password mismatch")
                return;

            }

            next();

            // res.redirect("/");

        },
        getHomeView
);




module.exports = router;