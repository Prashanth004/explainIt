var express = require('express');
var router = express.Router();
var feedback = require('../controller/feedBack')
const passport = require('passport');

const upload = require('../controller/fileOperation');
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




router.use('/savefile',passport.authenticate('jwt', { session: false }),upload.handleFiles)

router.post('/savefile', passport.authenticate('jwt', { session: false }), feedback.saveFeedBackFiles);
router.post('/', passport.authenticate('jwt', { session: false }),feedback.saveFeedBack);
router.get('/single/:id',passport.authenticate('jwt', { session: false }),feedback.getFeedBackById);
router.get('/all',passport.authenticate('jwt', { session: false }), feedback.getAllFeedBack);
router.get('/user',passport.authenticate('jwt', { session: false }),feedback.getMyFeedBack)
module.exports = router;