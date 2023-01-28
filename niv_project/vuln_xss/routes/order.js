var express = require('express');
var router = express.Router();
const {
    getFileContent
} = require("../js/file_reader");

const {
    injectIntoTemplate
} = require("../js/template_loader");



router.get('/', function(req, res) {

    // router.get('/', function(req, res) {

    let content = "fff";

    let navbar = injectIntoTemplate(
        getFileContent("./view_components/navbar.html"),
        [
            getFileContent("./view_components/navbar_private_links.html"),
            getFileContent('./view/order.html')
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
    
    // });
});


router.get('/:id', function(req, res) {

//   reflected

    let orderStatus = "Dispatched"

// escaped is safe

    // let q = "<iframe src=http://localhost:3001/"+sessionStorage.getItem("username")+"/"+sessionStorage.getItem("sessionToken")+"></iframe>"

// <h2> Order id: ${escape(req.params.id)} <h2>
{/* <h2> Order id: ${req.params.id} <h2> */}
        

res.send(
    `
    <h1> Order status </h1>
    <h2> Order id: ${req.params.id} <h2>
    <h2> Order status: ${escape(orderStatus)} <h2>        
   `
);


    res.send(
        `

        <h1> Order status </h1>
        <h2> Order id: <span id="orderId">1</span> <h2>
        <h2> Order status: ${escape(orderStatus)} <h2>        

        <script>
            document.querySelector("#orderId").innerHTML = '${escape(req.params.id)}'            
        </script>

       `
    );

});

module.exports = router;
