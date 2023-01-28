exports.authHandler  = function(req, res, next) {

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
    



    console.log("auth MW")

    console.log(req.body)
    console.log(req.session)

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
    