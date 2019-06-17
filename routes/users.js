var express = require('express');
var router = express.Router();
const passport = require('passport');
var user = require('../controller/user');
const key  = require('../config/keys');
var jwt = require('jsonwebtoken');
require('../config/passport-setup');
var request = require('request');
var qs = require('querystring')
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
 
// 

//Basic login form authentication system
router.post('/onboard',user.onBoardUser)
router.get('/email/:email',user.getUserByEmail)
router.post('/all', passport.authenticate('local', { session: false }), user.getAllUsers)
router.get('/id/:id',user.getUserById)
router.post('/updateprofile',passport.authenticate('jwt', { session: false }),user.updateProfile)
router.get('/twitterhandle/:enctwitterhandle', user.getUserByTwitteHandle)
router.post('/register', user.createUser);
router.get('/busystatus', passport.authenticate('jwt', { session: false }),user.getBusyStatus)
router.put('/turnbusy',passport.authenticate('jwt', { session: false }),user.turnBusy)
router.put('/turnnotbusy',passport.authenticate('jwt', { session: false }), user.turnNotBusy)
router.put('/onlinestatus',passport.authenticate('jwt', { session: false }),user.updateOnlineStatus)
router.post('/authenticate',user.authenticate);
router.put('/deactivate',passport.authenticate('local', { session: false }), user.deactivate)
router.put('/activate',passport.authenticate('local', { session: false }), user.activate)
router.get('/activationstatus/:twitterhandle', user.getActivationStatus);
router.get('/emailStatus',passport.authenticate('jwt', { session: false }), user.getEmailStatus)
router.put('/emailactivation', passport.authenticate('jwt', { session: false }), user.emailActivation)
router.post('/sendotp',passport.authenticate('jwt', { session: false }),user.sendotp);
router.post('/resendotp',passport.authenticate('jwt', { session: false }), user.resend); 
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	if (req.user && req.user.activation==='1' ) {
    
		res.status(200).send({ user: req.user })
	} else {
        res.status(401).send({ user: null})
	}
});
router.get('/explain', passport.authenticate('jwt', { session: false }), (req, res) => {
	if (req.user) {
    
		res.status(200).send({ user: req.user })
	} else {
        res.status(401).send({ user: null})
	}
});
router.get('/logout', (req, res) => {
    req.logout();
    res.send({ success: 1, msg: "logout successful" })
});


getGitAccesstoken=(req,res,next)=>{



}



router.use('/git',function(req,res,next){
 
  const code = req.query.code;
  const returnedState = req.query.state;
  const redirect_uri =frontEndDomain+"/git"
  request.post(
    {
      url:
        'https://github.com/login/oauth/access_token?' +
        qs.stringify({
          client_id: key.gitHub.clientId,
          client_secret: key.gitHub.clientSecret,
          code: code,
          redirect_uri: redirect_uri,
          state:returnedState
        })
    },
    (error, response, body) => {
     
      req.body['access_token'] = qs.parse(body).access_token;
   
     next()
    }
  );

})




//Goolge authentication
router.post('/google',  passport.authenticate('google-token'),function(req,res){
    var token = createToken(req.user);
   
    res.json({ success: 1, token: 'JWT ' + token, user:req.user});
});


router.all('/git',  passport.authenticate('github-token'), function(req,res){
  var token = createToken(req.user);
  res.json({ success: 1, token: 'JWT ' + token, user:req.user });
} )











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
