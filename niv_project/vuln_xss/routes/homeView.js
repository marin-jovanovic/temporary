

const {getFileContent} = require("../js/file_reader");
const {injectIntoTemplate} = require("../js/template_loader");
const db = require("../js/db");

async function getHomeView(req, res, next) {

    console.log();
    console.log("getHomeView")
    console.log(req.body)
    console.log("logged in")

    let username = req.body.username;
    let password = req.body.password;
    
    console.log(username, password
        );


    let authObj = await db.login(username, password);

    console.log(authObj)

    
    let navbar = injectIntoTemplate(
        getFileContent("./view_components/navbar.html"), 
        [
            getFileContent("./view_components/navbar_private_links.html"),
            injectIntoTemplate(
                getFileContent('./view/home.html'),
                [
                    injectIntoTemplate(
                        getFileContent("./view_components/hidden_fields.html"),
                        [authObj.sessionToken, authObj.syncCSRFToken]
                    )
                ]
            )
        ]       
    )
    
    let r = injectIntoTemplate(
        getFileContent("./view_components/base.html") , 
        [navbar]
    )

    res.send(r);



}


exports.getHomeView = getHomeView;
