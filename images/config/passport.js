var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('./keys');
var database = require('../app')
// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  var opts = {};
 
  opts.jwtFromRequest =  ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
      console.log("jwt_payload :"+jwt_payload.id)
    database.db.oneOrNone('select * from users where id = $1', jwt_payload.id)
    .then(function( user) {
      if (user) {
          console.log(user)
        done(null, user);
      } else {
        done(null, false);
      }
    }).catch(function(err){
        return done(err, false);
    })
  }));
};