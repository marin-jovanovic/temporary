

// const {authHandler} = require("../js/middleware");
const {getFileContent} = require("../js/file_reader");

const {injectIntoTemplate} = require("../js/template_loader");
const db = require("../js/db");
// const { use } = require(".");

async function getHomeView(req, res, next) {
    // (async () => {

    console.log();

    console.log("getHomeView")

    console.log(req.body)

    let username = req.body.username;
    let password = req.body.password;
    
    let isLoggedIn = await db.isAuthOk(username, password);

    let navbar;

    if (isLoggedIn) {
        console.log("logged in")

        navbar = injectIntoTemplate(
            getFileContent("./view_components/navbar.html"), 
            [
                getFileContent("./view_components/navbar_private_links.html"), 
                getFileContent('./view/home.html')
            ]       
        )
    
    


    } else {
        console.log("not logged in")

        navbar = injectIntoTemplate(
            getFileContent("./view_components/navbar.html"), 
            [
                getFileContent("./view_components/navbar_public_links.html"), 
                getFileContent('./view/login.html')
            ]       
        )
    
        // let r = injectIntoTemplate(
        //     getFileContent("./view_components/base.html") , 
        //     [navbar]
        // )
    

        // res.send(r);
    

    }

    let r = injectIntoTemplate(
        getFileContent("./view_components/base.html") , 
        [navbar]
    )

    res.send(r);


// })();

}


exports.getHomeView = getHomeView;
