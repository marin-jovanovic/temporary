var express = require('express');
var router = express.Router();
// const Vozac = require('../models/Vozac');
// const Tvrtka = require('../models/Tvrtka');
// const KorisnikPodatci = require('../tools/KorisnikPodatci');
// const VoziloPodatci = require('../tools/VoziloPodatci');
// const ParkingPodatci = require('../tools/ParkingPodatci');
// const RezervacijaPodatci = require('../tools/RezervacijaPodatci');
// const { body, validationResult } = require('express-validator');
// const Vozilo = require('../models/Vozilo');
// const Funkcija = require('../trash/funkcije');
// const NodeGeocoder = require('node-geocoder');
// const db = require('../database');


const {authHandler} = require("../js/middleware");
// const {getFileContent} = require("../js/file_reader");

// const {injectIntoTemplate} = require("../js/template_loader");

const {getHomeView} = require("./homeView");

router.get('/', authHandler, getHomeView);



module.exports = router;
