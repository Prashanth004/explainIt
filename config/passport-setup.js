const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const TwitterTokenStrategy = require('passport-twitter-token');
const keys = require('./keys');
var LocalStrategy = require('passport-local').Strategy;
var rn = require('random-number');
var database = require('../app');
var jwt = require('jsonwebtoken');


var options = {
    min:  -10000
  , max:  10000
  , integer: true
  }

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
            return ({ msg: err.message });

        });
});



passport.use(new GoogleTokenStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  },
  function(accessToken, refreshToken, email, done)  {
      console.log("email : ",email)
      if(email._json.image){
            var profile_image =email._json.image.url
      }
      else{
        var profile_image =email._json.picture
      }
      console.log("as;kvncoajvzoljbdnvohaodbvsjodbiahdfib")

        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        console.log("about to check dab")
            database.db.oneOrNone('select * from users where email = $1', email.emails[0].value)
            .then((currentUser) => {
                if (currentUser) {
                    console.log("current user : ",currentUser)
                    
                    done(null, currentUser);
                  }
                  else{
                    console.log("no user")
                 
                    database.db.none('insert into users(username, password, email, profilepic,date, payment, id)' +
                        'values(${name}, ${password}, ${email},${profilepic},${date},${payment},${id})',
                        {
                            name: email.displayName,
                            password: email.id,
                            email: email.emails[0].value,
                            profilepic:profile_image,
                            date: datetime,
                            payment: 0,
                            date: datetime,
                            id:email.id
                        })


                        .then(() => {
                            console.log("successfull !!!")
                            database.db.one('select * from users where email = $1', email.emails[0].value)
                            .then((newUser) => {
                                console.log("newUser !!!!!!" + newUser.username)
                                done(null, newUser);
                            })


                        }).catch(function (err) {
                            console.log("error : ",err)
                            done(err, false)

                        });
                  
                    }
                    })
                    .catch(function (err) {
                    })
          

          

    })
);
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
        console.log("profile : ", profile)
        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

        database.db.oneOrNone('select * from users where id = $1', profile.id)
            .then((currentUser) => {
                if (currentUser) {
                    // already have this user
console.log("existing user")
                    done(null, currentUser);
                } else {
                    console.log("new user")
                    database.db.none('insert into users(username, password, email, profilepic,date, payment, id)' +
                        'values(${name}, ${password}, ${email},${profilepic},${date},${payment},${id})',
                        {
                            name: profile.displayName,
                            password: profile.id,
                            email:rn(options),
                            profilepic: profile._json.profile_image_url,
                            date: datetime,
                            payment: 0,
                            id: profile.id,
                        }).then(() => {
                            console.log("saved New user")
                            database.db.one('select * from users where email = $1', email.emails[0].value)
                                .then((newUser) => {
                                    console.log("newUser !!!!!!" + newUser.username)
                                    done(null, newUser);
                                })

                        }).catch(function (err) {

                            console.log("error in saving ",err)
                            done(err, false)

                        });

                }
            })
    }));


