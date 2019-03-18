var express = require('express');
var router = express.Router();
const passport = require('passport');
var user = require('../controller/user');
const key  = require('../config/keys');
var jwt = require('jsonwebtoken');
require('../config/passport-setup');
var request = require('request');
var qs = require('querystring')

//Basic login form authentication system
router.get('/email/:email',user.getUserByEmail)
router.get('/id/:id',user.getUserById)
router.get('/twitterhandle/:enctwitterhandle', user.getUserByTwitteHandle)
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
    // console.log(req.user)
    req.logout();
    res.send({ success: 1, msg: "logout successful" })
});


getGitAccesstoken=(req,res,next)=>{



}



router.use('/git',function(req,res,next){
  // console.log('Request sent by GitHub: ');
  // console.log(req.query);
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
      // The response will contain your new access token
      // this is where you store the token somewhere safe
      // for this example we're just storing it in session
      // console.log('Your Access Token: ');
      // console.log(qs.parse(body));
      // req.access_token = qs.parse(body).access_token;
      req.body['access_token'] = qs.parse(body).access_token;
      // console.log("req.accesstoken ::: ",req.access_token);
     

      // Redirects user to /user page so we can use
      // the token to get some data.
     next()
    }
  );

})




//Goolge authentication
router.post('/google',  passport.authenticate('google-token'),function(req,res){
    var token = createToken(req.user);
    // console.log(token)
    res.json({ success: 1, token: 'JWT ' + token, user:req.user});
});


router.all('/git',  passport.authenticate('github-token'), function(req,res){
  var token = createToken(req.user);
  // console.log(token)
  res.json({ success: 1, token: 'JWT ' + token, user:req.user });
} )

// router.all('/git/redirect', function(req,res){
//   console.log("req.access_token : ",req.access_token)
//   request.get(
//     {
//       url: 'https://api.github.com/user/public_emails',
//       headers: {
//         Authorization: 'token ' + req.access_token,
//         'User-Agent': 'Login-App'
//       }
//     },
//     (error, response, body) => {
//       // console.log("response: ", response)
//       console.log("body :", body)
//       res.send(
//         "<p>You're logged in! Here's all your emails on GitHub: </p>" +
//         body +
//         '<p>Go back to <a href="/">log in page</a>.</p>'
//       );
//     }
//   );

//   // var token = createToken(req.user);
//   // console.log(token)
//   // res.json({ success: 1, token: 'JWT ' + token });
  
// })










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
