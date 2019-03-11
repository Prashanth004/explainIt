var express = require('express');
var router = express.Router();
var message = require('../controller/message')
const passport = require('passport');
const bodyParser = require('body-parser');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));


router.post("/" , passport.authenticate('jwt', { session: false }),message.saveMessage)
router.get("/:userid", passport.authenticate('jwt', { session: false }),message.getMessage)

module.exports = router;