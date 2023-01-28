var express = require('express');
var router = express.Router();

const {
    authHandler
} = require("../js/middleware");

const {
    getHomeView
} = require("./homeView");

router.get('/', authHandler, getHomeView);



module.exports = router;