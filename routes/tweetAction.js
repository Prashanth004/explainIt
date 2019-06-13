const express = require('express');
const router =  express.Router();
const passport = require('passport');
const twitteActionsController =  require('../controller/tweetAction.js');
const bodyParser = require('body-parser');

router.post('/getid',  twitteActionsController.getid);
router.post('/tweet', twitteActionsController.tweetRecoding);
router.get('/twitterhandles', passport.authenticate('jwt', { session: false }),twitteActionsController.twitterlist)

module.exports = router;