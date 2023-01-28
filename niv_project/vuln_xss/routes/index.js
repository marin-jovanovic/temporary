var express = require('express');
var router = express.Router();
// const Vozac = require('../models/Vozac');
// const Tvrtka = require('../models/Tvrtka');
// const KorisnikPodatci = require('../tools/KorisnikPodatci');
// const VoziloPodatci = require('../tools/VoziloPodatci');
// const ParkingPodatci = require('../tools/ParkingPodatci');
// const RezervacijaPodatci = require('../tools/RezervacijaPodatci');
const { body, validationResult } = require('express-validator');
// const Vozilo = require('../models/Vozilo');
// const Funkcija = require('../trash/funkcije');
// const NodeGeocoder = require('node-geocoder');
// const db = require('../database');


const {authHandler} = require("../js/middleware");
const {getFileContent} = require("../js/file_reader");

const {injectIntoTemplate} = require("../js/template_loader");

function getHomeView(req, res, next) {

    console.log(req.body)

    let isLoggedIn = true;

    if (isLoggedIn) {


        let navbar = injectIntoTemplate(
            getFileContent("./view_components/navbar.html"), 
            [
                getFileContent("./view_components/navbar_private_links.html"), 
                getFileContent('./view/home.html')
            ]       
        )
    
        let r = injectIntoTemplate(
            getFileContent("./view_components/base.html") , 
            [navbar]
        )
    
        res.send(r);
    


    } else {


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
    

    }

        // res.send(
    //     getFileContent("./view_components/navbar_public.html") + 
        
    //     getFileContent('./view/signup.html') + 
        
    //     "</div>"
    // );

    // res.send(
    //     `

    //     <a href="/track_order/12345">track order number 12345</a> 
    //     <br/>
    //     <a href="/createPost">create post</a> 
    //     <br/>
    //     <a href="/viewPosts">view posts</a> 
    //     <br/>
    //     csrf demo : <a href="/payment">go to payment</a> 
    //     `
    // )


}


exports.getHomeView = getHomeView;


router.get('/', authHandler, getHomeView);



module.exports = router;
