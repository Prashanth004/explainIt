var express = require('express');
var router = express.Router();
var key = require('../config/keys')
var jwt = require('jsonwebtoken');
const passport = require('passport');
var admin = require('../controller/admin')

var createToken = function(auth) {
    console.log(auth)
    return jwt.sign({
      id: auth.id
    },key.secret,
    {
      expiresIn: 8*7*24*60*60*1000
    });
  };

var generateToken = function (req, res, next) {
    var token = createToken(req.user);
    console.log(req.user)
    res.json({ success: 1, token: 'JWT ' + token, user:req.user });};

router.post('/authenticate', passport.authenticate('local', { session: false }),(req,res)=>{
    console.log(req.user)
    generateToken(req, res)
})
module.exports = router;