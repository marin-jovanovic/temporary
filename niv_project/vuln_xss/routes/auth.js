const {authHandler} = require("../js/middleware");
var express = require('express');
const { route } = require(".");
var router = express.Router();

const {getHomeView} = require("./homeView")

const {getFileContent} = require("../js/file_reader");

const {injectIntoTemplate} = require("../js/template_loader");

const db = require("../js/db");

// console.log(getHomeView())

router.get('/signup', function(req, res, next) {

    let navbar = injectIntoTemplate(
        getFileContent("./view_components/navbar.html"), 
        [
            getFileContent("./view_components/navbar_public_links.html"), 
            getFileContent('./view/signup.html')
        ]       
    )

    let r = injectIntoTemplate(
        getFileContent("./view_components/base.html") , 
        [navbar]
    )

    res.send(r);


});

router.get('/login', function(req, res, next) {

    let navbar = injectIntoTemplate(
        getFileContent("./view_components/navbar.html"), 
        [
            getFileContent("./view_components/navbar_public_links.html"), 
            getFileContent('./view/login.html')
        ]       
    )

    let r = injectIntoTemplate(
        getFileContent("./view_components/base.html") , 
        [navbar]
    )

    res.send(r);


});




router.post('/signup',
 function(req, res, next) {

    (async () => {

       let isLoggedIn = await db.addUser(req.body.username, req.body.password);

        if (! isLoggedIn) {

             res.send(`
                username already exists
            `)

            return
        } else {
            return next();

        }


     })();



},
//     console.log("post signup")
//     console.log(req.body);


//     // (async () => {

//     //    let isLoggedIn = await db.addUser(req.body.username, req.body.password);
       

//         // if (isLoggedIn) {

//         //     req.session.valid = true;
//         //     res.redirect('/');

//         // } else {

//         //     res.send(`
//         //         username already exists
//         //     `)

//         // }



//         return next();

//     //  })();
     

//     // let synchronizerToken = "123"
//     // let sessionToken = "456"

//     // res.redirect('/');

//     // res.json({
//     //     status: true,
//     //     username: req.body.username,
//     //     synchronizerToken:  synchronizerToken,
//     //     sessionToken: sessionToken,
//     // });


// },

// function(req, res, next) {

//     console.log("prije")
//     console.log(req.body);

//         // res.redirect('/');


//     return next();


// }, 


getHomeView);



router.post('/login', function(req, res, next) {

    // let navbar = injectIntoTemplate(
    //     getFileContent("./view_components/navbar.html"), 
    //     [
    //         getFileContent("./view_components/navbar_public_links.html"), 
    //         getFileContent('./view/login.html')
    //     ]       
    // )

    // let r = injectIntoTemplate(
    //     getFileContent("./view_components/base.html") , 
    //     [navbar]
    // )

    res.send("post login done");


});




module.exports = router;
