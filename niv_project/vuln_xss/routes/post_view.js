var express = require('express');
var router = express.Router();
const {
    getFileContent
} = require("../js/file_reader");

const {
    injectIntoTemplate
} = require("../js/template_loader");

const db = require("../js/db");

router.get('/', function(req, res) {

    let posts = db.getAllPosts();

    let postsFormatted = "";

    posts.forEach(element => {
        postsFormatted += '<p  style="background-color:red;">' + element.content + "</p>"


        let e = escape(element.content)

        postsFormatted += '<p  style="background-color:powderblue;">' + e + "</p>"

    });



    let content = `

    <h1>view posts</h1>

    ${postsFormatted}
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
