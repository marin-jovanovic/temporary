
const { appendFile } = require("fs");
const db = require("./db");
const {injectIntoTemplate} = require("../js/template_loader");
const {getFileContent} = require("../js/file_reader");

exports.authHandler  = async function(req, res, next) {
    console.log("auth MW")

    /**
     * 
     * access control allow origin
     * neautenitificarni req
     * 
     * ...     credentials
     * ne moze imat ACAO *
     * i mora imat popis tocno domene koje prihvaca
     * auth req
     * 
     * 
     * 
     */


    let username = req.body.username;
    let password = req.body.password;
    let accessToken = req.body.accessToken;
    let syncCSRFToken = req.body.syncCSRFToken;

    console.log(username, password, accessToken, syncCSRFToken);

    let credentilsOk = false;

    if (username && password) {
        
        let authObj = await db.isAuthOk(username,   password);

        if (authObj.status)  {
            credentilsOk = true;
        }

    }


    if (! credentilsOk) {
        console.log("credentials not ok");
      
    
    let        navbar = injectIntoTemplate(
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
    
        res.url = "nekinoviurl"
    
        res.send(r);


        return




    }



    // console.log(req.body)
    // console.log(req.session)

        // if (req.sessionToken) {
            next();
        // } else {
        //     res.redirect("/login");
        // }
    
        //   if (req.session.user === undefined) {
        //       req.session.err = "Please login to view the requested page."
        //       req.session.save(() => {
        //           res.redirect('/login');
        //       });
        //   } else {
        //       next();
        //   }
    }
    