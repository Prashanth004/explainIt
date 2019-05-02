var express = require('express');
var router = express.Router();
var message = require('../controller/message')
const passport = require('passport');
const bodyParser = require('body-parser');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/totalunread', passport.authenticate('jwt', { session: false }), message.getUnreadNumber)
router.post("/" , passport.authenticate('jwt', { session: false }),message.saveMessage);
router.post('/replyaction',passport.authenticate('jwt', { session: false }),message.replyaction);
router.get("/:userid", passport.authenticate('jwt', { session: false }),message.getMessage)
router.get('/checkreplyinfo/:issueid',passport.authenticate('jwt', { session: false }),message.checkReplyInfo)
router.put('/changeunread/:messageid',passport.authenticate('jwt', { session: false }), message.changeUnread)
module.exports = router;