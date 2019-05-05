const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const TwitterTokenStrategy = require('passport-twitter-token');
const keys = require('./keys');
var LocalStrategy = require('passport-local').Strategy;
var database = require('../app');
var GitHubTokenStrategy = require('passport-github-token');



passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    database.db.any('select * from users where id = $1', id)
        .then((user) => {

            if (user) {
                done(null, user);
            }

        })
        .catch(function (err) {
            console.log(err)
         

        });
});

passport.use(new GoogleTokenStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  },
  function(accessToken, refreshToken, email, done)  {
   
      if(email._json.image){
            var profile_image =email._json.image.url
      }
      else{
        var profile_image =email._json.picture
      }
     
        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
            database.db.oneOrNone('select * from users where email = $1', email.emails[0].value)
            .then((currentUser) => {
                if (currentUser) {
                    done(null, currentUser);
                  }
                  else{
                    database.db.none('insert into users(username, password, email, profilepic,date, payment, id)' +
                        'values(${name}, ${password}, ${email},${profilepic},${date},${payment},${id})',
                        {
                            name: email.displayName,
                            password: email.id,
                            email: email.emails[0].value,
                            profilepic:newProfilePic,
                            date: datetime,
                            payment: 0,
                              id:email.id,
                             
                        })
                        .then(() => {
                            database.db.one('select * from users where email = $1', email.emails[0].value)
                            .then((newUser) => {
                                done(null, newUser);
                            })

                        }).catch(function (err) {
                            console.log("error : ",err)
                            // done(err, false)

                        });
                    }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
    })
);


passport.use(new GitHubTokenStrategy({
    clientID: keys.gitHub.clientId,
    clientSecret: keys.gitHub.clientSecret,
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
        
        database.db.oneOrNone('select * from users where email = $1', profile.emails[0].value)
            .then((currentUser) => {
                if (currentUser) {
                    // already have this user
                    done(null, currentUser);
                }
                else{
                    database.db.none('insert into users(username, password, email, profilepic,date, payment, id)' +
                        'values(${name}, ${password}, ${email},${profilepic},${date},${payment},${id})',
                        {
                            name: profile.displayName,
                            password: profile.id,
                            email:profile.emails[0].value,
                            profilepic: profile._json.avatar_url,
                            date: datetime,
                            payment: 0,
                            id: profile.id,
                        }).then(() => {
                            database.db.one('select * from users where email = $1', profile.emails[0].value)
                                .then((newUser) => {
                                    done(null, newUser);
                                })

                        }).catch(function (err) {

                            console.log("error in saving ",err)
                            done(err, false)

                        });

                }
            }).catch((error)=>{
                
                console.log("error in saving ",error)
                done(error, false)
            })

   
   
}))


passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        database.db.oneOrNone('select * from users where email = $1', email).then((User) => {
            if (User) {

                if (User.password == password) {
                    done(null, User);
                }
                else {
                    // return res.status(403).send("failed")
                    return done(null, false, { message: 'Incorrect email or password.' });

                }
            }

        });
       

    })
);


passport.use(new TwitterTokenStrategy({
    consumerKey: keys.twitter.key,
    consumerSecret: keys.twitter.secret,
    includeEmail: true
},
    function (token, tokenSecret, profile, done) {
        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
            var newProfilePic = profile._json.profile_image_url.replace("_normal","")
        database.db.oneOrNone('select * from users where id = $1', profile.id)
            .then((currentUser) => {
                if (currentUser) {
                    // already have this user
                    console.log("already a user")
                    done(null, currentUser);
                } else {
                    database.db.none('insert into users(username, password, profilepic,date, payment, id, twitterhandle)' +
                        'values(${name}, ${password}, ${profilepic},${date},${payment},${id},${twitterhandle})',
                        {
                            name: profile.displayName,
                            password: profile.id,
                            profilepic: newProfilePic,
                            date: datetime,
                            payment: 0,
                            id: profile.id,
                            activation:0,
                            online:1,
                            twitterhandle:profile.username
                        }).then(() => {
                            database.db.oneOrNone('select * from users where twitterhandle = $1', profile.username)
                                .then((newUser) => {
                                    done(null, newUser);
                                })

                        }).catch(function (err) {

                            console.log("error in saving ",err)
                            done(err, false)

                        });

                }
            })
    }));


