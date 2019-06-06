

var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config/keys');
var nodemailer = require('nodemailer');
var promise = require('bluebird');
var key = require('../config/keys');
var Twitter = require('twitter');


require('../config/passport')(passport)
var options = {
    promiseLib: promise
};
var database = require('../app')
var rn = require('random-number');
var options = {
    min: -10000
    , max: 10000
    , integer: true
}
const client = new Twitter({
    consumer_key: 'Auz3a4BeVAVKRcO1ZVvRvbJDa',
    consumer_secret: 'FDBIlsYilBeoAi2vZyZubM0qFEPtJeaPoPVQ6ki2g2M9xqTTiA',
    access_token_key: '1090895508699176960-dwE2I31URS2FFnctXJmcWzL75Des6o',
    access_token_secret: 'LCEHpUBTU4yxMY5YYJxPKI8A6eVqoIJehImLYByU9HhB1'
  });


var createToken = function (auth) {
    return jwt.sign({
        id: auth.id
    }, key.secret,
        {
            expiresIn: 8 * 7 * 24 * 60 * 60 * 1000
        });
};



exports.onBoardUser = function (req,res){
    var params = {
        "screen_name":req.body.twitterhandler
     }
     console.log("req.body.twitterhandler : ",req.body.twitterhandler)
      client.get('users/show.json', params, function(error,body ,response){
         if(error!==null){
             console.log("error : ",error)
            res.status(200).send({
                success:0
            })
         }  
         else{
            console.log(" no error : ",body)
            var newProfilePic = body.profile_image_url_https.replace("_normal","");
            var currentdate = new Date();
            var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth() + 1) + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
            res.status(200).send({
                success:1
            })
            database.db.oneOrNone('select * from users where twitterhandle = $1', req.body.twitterhandler)
            .then(function (data) {
                if (!data) {
                    database.db.none('insert into users(username,twitterhandle, password, profilepic,date, payment, id,activation)' +
                        'values(${name},${twitterhandle},${password},${profilepic},${date},${payment},${id},${activation})',
                        {
                            id:body.id_str,
                            twitterhandle:req.body.twitterhandler,
                            password:body.id_str,
                            profilepic : newProfilePic,
                            name: body.name,
                            payment:0,
                            activation:0,
                            date:datetime
                        }
                    ).then(data=>{
                    })
                    .catch(error=>{
                    })
                }
            })
            .catch(err=>{
            })
        }
})
}


exports.getBusyStatus = (req,res)=>{
    database.db.oneOrNone('select * from users where id = $1',req.user.id)
    .then(data=>{
        if(data && data!==null){
            if(data.busy === 1){
                res.status(200).send({
                    success:1,
                    bussystatus:1
                })
            }
            else{
                res.status(200).send({
                    success:1,
                    bussystatus:0
                })
            }
        }
        else{
            res.status(200).send({
                success:1,
                bussystatus:0
            })
        }
    })
    .catch(err=>{
        console.log("error : ".err)
        res.status(500).send({
            success:0,
           msg:err
        })
    })
}


const UpdateBusy =(res,queryObj)=>{
    database.db.oneOrNone(queryObj.sql,queryObj.data)
    .then(data=>{
        res.status(202).send({
            success:1
        })
    })
    .catch(error=>{
        console.log("error : ",error)
        res.status(500).send({
            success:0,
            msg:error
        })
    })
}

exports.turnBusy = (req,res)=>{
    var query1 = {
        'sql':'update users SET busy = $1 WHERE id = $2',
        'data': [1, req.user.id]
    }
    var query2 ={}
    if(req.body.action === config.FULL_SCREEN_RECORD){
        UpdateBusy(res,query1)
    }
    else if(req.body.action === config.FULL_SCREEN_SHARE){
        query2 = {
            'sql':'update users SET busy = $1 WHERE id = $2',
            'data': [1, req.body.recieverCallId]
        }
        database.db.oneOrNone(query1.sql,query1.data)
        .then(data=>{
            database.db.oneOrNone(query2.sql,query2.data)
            .then(data=>{
                res.status(202).send({
                    success:1
                })
            })
        })
        .catch(error=>{
            console.log("error : ",error)
            res.status(500).send({
                success:0,
                msg:error
            })
        })
    }
    else
        res.status(500).send({
            success:0,
            msg:"in valid action"
        })
}

exports.turnNotBusy =(req,res)=>{
    var query1 = {
        'sql':'update users SET busy = $1 WHERE id = $2',
        'data': [0, req.user.id]
    }
    var query2 ={}
    if(req.body.action === config.FULL_SCREEN_RECORD){
        console.log("considering it as recording")
        UpdateBusy(res,query1)
    }
    else if(req.body.action === config.FULL_SCREEN_SHARE){
        console.log("considering it as sharing")
        console.log('req.body.recieverCallId : ',req.body.recieverCallId)
        console.log('req.body.recieverCallId : ',typeof(req.body.recieverCallId))
        query2 = {
            'sql':'update users SET busy = $1 WHERE id = $2',
            'data': [0, req.body.recieverCallId]
        }
        database.db.oneOrNone(query1.sql,query1.data)
        .then(data=>{
            database.db.oneOrNone(query2.sql,query2.data)
            .then(data=>{
                res.status(202).send({
                    success:1
                })
            })
        })
        .catch(error=>{
            console.log("error : ",error)
            res.status(500).send({
                success:0,
                msg:error
            })
        })
    }
    else
     res.status(500).send({
        success:0,
        msg:"in valid action"
    })

}


exports.updateProfile = function (req, res) {

    database.db.none('update users SET bio = $1, cost =$2, angellist =$3,linkedin =$4, github=$5,goodat=$6, works=$7 WHERE id = $8',
        [req.body.bio,
        req.body.cost,
        req.body.angellist,
        req.body.linkedin,
        req.body.github,
        req.body.goodat,
        req.body.works,
        req.user.id,
        ]).then(data => {
            database.db.oneOrNone('select * from users where id = $1', req.user.id)
                .then(data => {
                    if (data !== null) {
                        res.status(200).send({
                            success: 1,
                            data: data
                        })
                    }
                    else {
                        res.status(200).send({
                            success: 1,
                            data: req.user
                        })
                    }
                })
                .catch(err => {
                    res.status(200).send({
                        success: 1,
                        data: req.user
                    })
                })

        })
        .catch(error => {
            res.status(500).send({
                sussecc: 0,
                error: error
            })
        })

}
exports.getUserByEmail = function (req, res) {
    database.db.oneOrNone('select * from users where email = $1', req.params.email)
        .then(data => {
            if (data) {
                res.status(200).send({
                    success: 1,
                    data: data
                })
            }
        }).catch(err => {
            console.log("error : ", err)
            if (err) {
                res.status(500).send({
                    success: 0,
                    msg: err
                })
            }
        })
}
exports.getEmailStatus = (req, res) => {
    database.db.oneOrNone('select * from users where id=$1', [req.user.id])
        .then(data => {
            if (data) {
                if (data.email!==null) {

                    res.status(200).send({
                        success: 1,
                        data: data
                    })

                }
            }
            else
                res.status(200).send({
                    success: 0
                })
        })
        .catch(error => {
            res.status(500).send({
                success: 0,
                error: error
            })
        })
}
exports.getActivationStatus = (req, res) => {
    console.log(req.params.twitterhandle)
    database.db.oneOrNone('select * from users where UPPER(twitterhandle) = $1 and activation = $2', [req.params.twitterhandle.toUpperCase(),1])
        .then(data => {
            console.log(data)
            if (data) {
                if (data!==null) {

                    res.status(200).send({
                        success: 1,
                        data: data
                    })

                }
            }
            else
                res.status(200).send({
                    success: 0
                })
        })
        .catch(error => {
            res.status(500).send({
                success: 0,
                error: error
            })
        })
}
exports.updateOnlineStatus = (req, res) => {
    console.log('req.body.onlineStatus : ', req.body.onlineStatus)
    const onlineStatus = (req.body.onlineStatus) ? (1) : (0)
    database.db.none('UPDATE users SET online = $1 where id = $2', [onlineStatus, req.user.id])
        .then(data => {
            res.status(200).send({
                success: 1,
                data: data
            })
        })
        .catch(error => {
            console.log("error : ", error)
            res.status(500).send({
                success: 0,
                error: error
            })
        })
}

const sendEmail = (toAddress, Subject, emailContent) => {
     var transporter = nodemailer.createTransport({
       host: "smtp.gmail.com", // hostname
	secure: true,// use SSL
        port: 465,
               auth: {
            user: config.ADMIN_EMAIL,
            pass: config.EMAIL_PASSWORD
        }
    });
    // host: 'bookmane.in',
    // port: 465,
    // secure: true,        
    // auth: {
    //     user: 'hello@bookmane.in',
    //     pass: 'B08Sj+j3t?w)'
    // }
    // var smtpTransport = nodemailer.createTransport('SMTP', {
    //     service: 'Gmail',
    //     auth: {
    //       XOAuth2: {
    //         user: smtpConfig.user,
    //         clientId: smtpConfig.client_id,
    //         clientSecret: smtpConfig.client_secret,
    //         refreshToken: smtpConfig.refresh_token,
    //         accessToken: smtpConfig.access_token,
    //         timeout: smtpConfig.access_timeout - Date.now()
    //       }
    //     }
    //   };
    var mailOptions = {
        from: '"Bookmane Labs" <bookmanelabs@gmail.com>',
        to: toAddress,
        subject: Subject,
        html: emailContent
    };

    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            console.log("email send failed: ", err)
            // return 
        }
        console.log("successfull")
        // return     
    });

}
exports.sendEmail = sendEmail
exports.resend = (req, res) => {
    database.db.oneOrNone('select * from users where id = $1', req.user.id)
        .then(data => {
            if (data) {
                var passocde = data.passcode
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: config.ADMIN_EMAIL,
                        pass: config.EMAIL_PASSWORD
                    }
                });
                var mailOptions = {
                    from: '"Bookmane Labs" <' + config.ADMIN_EMAIL + '>',
                    to: req.body.email,
                    subject: 'OTP for varification',
                    text: 'Hello,\n\n' + 'This is you passocde for authentication: \n\n \b' + passocde
                };
                transporter.sendMail(mailOptions, function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(201).send({ success: 1, msg: 'A verification email has been sent to ' + req.body.email + '.' });
                });

            }
        })

}
exports.sendotp = (req, res) => {
    database.db.none('update users SET passcode =$1 Where id = $2', [req.body.otp, req.user.id])
        .then((data) => {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.ADMIN_EMAIL,
                    pass: config.EMAIL_PASSWORD
                }
            });
            var mailOptions = {
                from: '"Bookmane Labs" <' + config.ADMIN_EMAIL + '>',
                to: req.body.email,
                subject: 'OTP for varification',
                text: 'Hello,\n\n' + 'This is you one time password for authentication: \n\n \b' + req.body.otp
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(201).send({ success: 1, msg: 'A verification email has been sent to ' + req.body.email + '.' });
            });
        })
        .catch(err => {
            res.status(500).send({ msg: err.message });
        })



}

exports.emailActivation = (req, res) => {
    database.db.none('update users SET email =$1,activation=$2 WHERE id=$3', [req.body.email, 1, req.user.id])
        .then(data => {
            var user = req.user;
            user.activation = 1;
            var token = createToken(user);
            res.json({ success: 1, token: 'JWT ' + token, user: req.user });

        })
        .catch(error => {
            console.log(error)
            res.status(500).send({
                success: 0,
                error: error
            })
        })
}

exports.getUserByTwitteHandle = function (req, res) {
    var twitterHandle = req.params.enctwitterhandle.toUpperCase();
    database.db.oneOrNone('select * from users where UPPER(twitterhandle) = $1', twitterHandle)
        .then(data => {

            if (data) {
                res.status(200).send({
                    success: 1,
                    data: data
                })
            }
            else {
                res.status(200).send({
                    success: 1,
                    data: null

                })
            }
        }).catch(err => {
            console.log("error : ", err)
            if (err) {
                res.status(500).send({
                    success: 0,
                    msg: err
                })
            }
        })

}
exports.getUserById = function (req, res) {
    database.db.oneOrNone('select * from users where id = $1', req.params.id)
        .then(data => {
            if (data) {
                res.status(200).send({
                    success: 1,
                    data: data
                })
            }
        }).catch(err => {
            console.log("error : ", err)
            if (err) {
                res.status(500).send({
                    success: 0,
                    msg: err
                })
            }
        })
}

exports.activate = (req,res)=>{
    database.db.none("UPDATE users SET activation = $1 where id = $2",[1,req.body.userid])
    .then(data=>{
        console.log("activated user")
        res.status(200).send({
            success :1,
            data:data
        })
    })
    .catch(error=>{
        res.status(500).send({
            success:0,
            error:error
        })
    })
}


exports.deactivate = (req,res)=>{
    database.db.none("UPDATE users SET activation = $1 where id = $2",[0,req.body.userid])
    .then(data=>{
        res.status(200).send({
            success :1,
            data:data
        })
    })
    .catch(error=>{
        res.status(500).send({
            success:0,
            error:error
        })
    })
}
exports.getAllUsers = (req, res)=>{
    console.log("req user ",req.user)
    database.db.manyOrNone('select * from users')
        .then(data => {
            res.status(200).send({
                success: 1,
                data: data
            })
        })
        .catch(error => {
            console.log("error : ",error)
            res.status(500).send({
                success: 0,
                error: error
            })
        })
}


exports.authenticate = function (req, res) {
    database.db.oneOrNone('select * from users where email = $1', req.body.email)
        .then(function (user) {

            if (!user) {
                res.status(401).send({ success: 0, message: 'Authentication failed. User not found.' });
            } else {
                // Check if password matches

                if (req.body.password === user.password) {
                    // Create token if the password matched and no error was thrown
                    user_modified = {
                        unsername: user.unsername,
                        password: user.password,
                        email: user.email,
                        profilepic: user.profilepic,
                        data: user.date,
                        payment: user.payment,
                        id: user.id

                    }
                    var token = jwt.sign(user_modified, config.secret, {
                        expiresIn: 100800 // in seconds
                    });
                    res.json({ success: 1, token: 'JWT ' + token });
                } else {
                    res.status(401).send({ success: 0, message: 'Authentication failed. Passwords did not match.' });
                }

            }
        })
        .catch(function (err) {
            console.log(err)
        })
}


exports.createUser = function (req, res, next) {
    var personInfo = req.body;
    if (!personInfo.email || !personInfo.name || !personInfo.password || !personInfo.passwordConf) {
        res.status(400).send({ success: 0, msg: "values in required fields missing" });
    } else {
        if (personInfo.password == personInfo.passwordConf) {
            database.db.oneOrNone('select * from users where email = $1', personInfo.email)
                .then(function (data) {
                    if (!data) {
                        database.db.none('insert into users(username, password, email, profilepic,date, payment, id)' +
                            'values(${name}, ${password}, ${email},${profilepic},${date},${payment},${id})',
                            {
                                name: personInfo.name,
                                password: personInfo.password,
                                email: personInfo.email,
                                profilepic: personInfo.img,
                                date: personInfo.datetime,
                                payment: 0,
                                id: rn(options),


                            }).then(() => {
                                // console.log("successfully created")
                                res.status(200).send({ "success": 1, msg: "successfully created" })
                            })
                            .catch((err) => {
                                res.send({ success: 0, "err": err })
                            }
                            )

                    }
                    else {
                        res.send({ success: 0, msg: "the email already exists" })
                    }
                })

        }
        else {
            res.send({ success: 0, msg: "passwords do not match" })
        }

    }
}
