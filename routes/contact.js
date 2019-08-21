var express = require('express');
var router = express.Router();
var contacts = require('../controller/contact')
const passport = require('passport');
router.get('/', passport.authenticate('jwt', { session: false }), contacts.getAllContact);
router.get('/id/:id',passport.authenticate('jwt',{session: false}), contacts.getAllContactById);
router.get('/contact/:id', passport.authenticate('jwt', { session: false }), contacts.getContactById);
router.post('/', passport.authenticate('jwt', { session: false }),contacts.saveContact);
// router.put('/:id');

module.exports = router;
 