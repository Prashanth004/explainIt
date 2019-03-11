passport.use(new TwitterTokenStrategy({
    consumerKey: keys.twitter.key,
    consumerSecret: keys.twitter.secret,
    includeEmail: true
},
    function (token, tokenSecret, profile, done) {
        console.log("profile : ", profile)
        var currentdate = new Date();
        var profilePicCpy = profile._json.profile_image_url
        var unwantedString = "_normal"
        var ProfilePic = profilePicCpy.replace(unwantedString,'')
        const encTwitterHandle = cryptr.encrypt(profile._json.screen_name);
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
                    database.db.none('insert into users(username, password, email, profilepic,date, payment, id,twitterhandle)' +
                        'values(${name}, ${password}, ${email},${profilepic},${date},${payment},${id},$(twitterhandle))',
                        {
                            name: profile.displayName,
                            password: profile.id,
                            email:rn(options),
                            profilepic: ProfilePic,
                            date: datetime,
                            payment: 0,
                            id: profile.id,
                            twitterhandle:encTwitterHandle
                        }).then(() => {
                            console.log("saved New user")
                            database.db.one('select * from users where id = $1', profile.id)
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