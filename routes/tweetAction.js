const express = require('express');
const router =  express.Router();
const passport = require('passport');
const twitteActionsController =  require('../controller/tweetAction.js');
const bodyParser = require('body-parser');

router.get('/getid/:twitterhandler', twitteActionsController.getid);
router.post('/tweet', twitteActionsController.tweetRecoding)

module.exports = router;