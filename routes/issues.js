var express = require('express');
var router = express.Router();
var issues = require('../controller/issues')
const passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/keys')
require('../config/passport')(passport)

/* GET home page. */
router.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });
router.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
   });


router.get('/',  issues.getAllIssues);
router.get('/:id', passport.authenticate('jwt', { session: false }), issues.getOneIssue);
router.post('/', passport.authenticate('jwt', { session: false }),issues.saveIssue)

module.exports = router;
 