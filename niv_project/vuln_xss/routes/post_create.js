var express = require('express');
var router = express.Router();
const {
    getFileContent
} = require("../js/file_reader");

const {
    injectIntoTemplate
} = require("../js/template_loader");
const db = require("../js/db");


router.post('/', function(req, res) {

    db.createPost(req.body["post"]);

    let content = `
        <h1>post published <a href="/viewPost">here</a></h1>
        <a href="/createPost">create another</a> 
        <br/>
           
    `;

    let navbar = injectIntoTemplate(
        getFileContent("./view_components/navbar.html"),
        [
            getFileContent("./view_components/navbar_private_links.html"),
            content
        ]
    )

    let r = injectIntoTemplate(
        getFileContent("./view_components/base.html"),
        [navbar]
    )

    res.send(r);


});


router.get('/', function(req, res) {


    let content = `

        <h1>create a post</h1>
        <form method="post">
            <label>write a post:
                <input name="post" autocomplete="start typing" />
            </label>
            <button>Sublish</button>
        </form>

        <br/>

    
    `;

    let navbar = injectIntoTemplate(
        getFileContent("./view_components/navbar.html"),
        [
            getFileContent("./view_components/navbar_private_links.html"),
            content
        ]
    )

    let r = injectIntoTemplate(
        getFileContent("./view_components/base.html"),
        [navbar]
    )

    res.send(r);


});

module.exports = router;
