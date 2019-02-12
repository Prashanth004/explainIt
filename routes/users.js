var express = require('express');
var router = express.Router();

const passport = require('passport');
var user = require('../controller/user');
const key  = require('../config/keys');
var jwt = require('jsonwebtoken');
require('../config/passport-setup')






//Basic login form authentication system
router.get('/email/:email',user.getUserByEmail)
router.post('/register', user.createUser);
router.post('/authenticate',user.authenticate)
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	if (req.user) {
		res.status(200).send({ user: req.user })
	} else {
        res.status(401).send({ user: null})
	}
});
router.get('/logout', (req, res) => {
    console.log(req.user)
    req.logout();
    res.send({ success: 1, msg: "logout successful" })
});



//Goolge authentication
router.post('/google',  passport.authenticate('google-token'),function(req,res){
    var token = createToken(req.user);
    console.log(token)
    res.json({ success: 1, token: 'JWT ' + token });
});







var createToken = function(auth) {
    return jwt.sign({
      id: auth.id
    },key.secret,
    {
      expiresIn: 60 * 1200
    });
  };






//Admin
router.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res) {
    res.send('It worked! User id is: ' + req.user.id + '.');
  });







module.exports = router;
