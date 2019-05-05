

var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config/keys');
var nodemailer = require('nodemailer');
var promise = require('bluebird');
var key = require('../config/keys');

require('../config/passport')(passport)
var options = {
    promiseLib: promise
};
var database = require('../app')
var rn = require('random-number');
var options = {
    min:  -10000
  , max:  10000
  , integer: true
  }


  var createToken = function(auth) {
    return jwt.sign({
      id: auth.id
    },key.secret,
    {
      expiresIn: 8*7*24*60*60*1000
    });
  };


exports.updateProfile = function(req,res){
   
    database.db.none('update users SET bio = $1, cost =$2, angellist =$3,linkedin =$4, github=$5,goodat=$6, works=$7 WHERE id = $8',
     [req.body.bio,
    req.body.cost,
    req.body.angellist,
    req.body.linkedin,
    req.body.github,
    req.body.goodat,
    req.body.works,
     req.user.id,
    ]).then(data=>{
        database.db.oneOrNone('select * from users where id = $1', req.user.id)
        .then(data=>{
            if(data!==null){
                res.status(200).send({
                    success:1,
                    data:data
                })
            }
            else{
                res.status(200).send({
                    success:1,
                    data:req.user
                }) 
            }
        })
        .catch(err=>{
            console.log("error : ",err)
            res.status(200).send({
                success:1,
                data:req.user
            })
        })

       
    })
    .catch(error=>{
        console.error("error : ",error)
        res.status(500).send({
            sussecc:0,
            error:error
        })
    })

}
exports.getUserByEmail = function(req,res){
    database.db.oneOrNone('select * from users where email = $1', req.params.email)
    .then(data=>{
        if(data){
            res.status(200).send({
                success:1,
                data:data
            })
        }
    }).catch(err =>{
        console.log("error : ",err)
        if(err){
            res.status(500).send({
                success:0,
                msg:err
            })
        }
    })
}
exports.getActivationStatus = (req,res)=>{
database.db.oneOrNone('select * from users where id=$1 and activation =$2',[req.user.id,1])
.then(data=>{
    if(data){
        if(data!==null){
           
            res.status(200).send({
                success:1,
                data:data
            })
        
        }
    }
    else
        res.status(200).send({
            success:0
        })
})
.catch(error=>{
    res.status(500).send({
        success:0,
        error:error
    })
})
}
exports.updateOnlineStatus = (req,res)=>{
    console.log('req.body.onlineStatus : ',req.body.onlineStatus)
    const onlineStatus = (req.body.onlineStatus)?(1):(0)
database.db.none('UPDATE users SET online = $1 where id = $2',[onlineStatus, req.user.id])
.then(data=>{
    res.status(200).send({
        success:1,
        data:data
    })
})
.catch(error=>{
    console.log("error : ",error)
    res.status(500).send({
        success:0,
        error:error
    })
})
}

const sendEmail = (toAddress, Subject, emailContent)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bookmanelabs@gmail.com',
            pass: 'bookmane321$'
        }
    });
    var mailOptions = {
        from: '"Bookmane Labs" <bookmanelabs@gmail.com>',
        to: toAddress,
        subject: Subject,
        html: emailContent
    };
  
    transporter.sendMail(mailOptions, function (err) {
            if(err){
                console.log("email send failed: ",err)
                // return 
            }
            console.log("successfull")
            // return     
    });

}
exports.sendEmail = sendEmail
exports.resend = (req,res)=>{
    database.db.oneOrNone('select * from users where id = $1',req.user.id)
    .then(data=>{
        if(data){
            var passocde = data.passcode
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.ADMIN_EMAIL,
                    pass: config.EMAIL_PASSWORD
                }
            });
            var mailOptions = {
                from: '"Bookmane Labs" <'+ config.ADMIN_EMAIL+'>',
                to: req.body.email,
                subject: 'OTP for varification',
                text: 'Hello,\n\n' + 'This is you passocde for authentication: \n\n \b'+passocde
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(201).send({ success: 1, msg: 'A verification email has been sent to ' + req.body.email + '.' });
            });

        }
    })

}
exports.sendotp = (req,res)=>{
    database.db.none('update users SET passcode =$1 Where id = $2',[req.body.otp, req.user.id])
    .then((data)=>{
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.ADMIN_EMAIL,
                    pass: config.EMAIL_PASSWORD
            }
        });
        var mailOptions = {
            from: '"Bookmane Labs" <'+ config.ADMIN_EMAIL+'>',
            to: req.body.email,
            subject: 'OTP for varification',
            text: 'Hello,\n\n' + 'This is you one time password for authentication: \n\n \b'+req.body.otp
        };
        transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(201).send({ success: 1, msg: 'A verification email has been sent to ' + req.body.email + '.' });
        });
    })
    .catch(err=>{
        res.status(500).send({ msg: err.message });
    })
  
  

}

exports.emailActivation=(req,res)=>{
    database.db.none('update users SET email =$1,activation=$2 WHERE id=$3',[req.body.email,1,req.user.id])
    .then(data=>{
        var user = req.user;
        user.activation = 1;
        var token = createToken(user);
        res.json({ success: 1, token: 'JWT ' + token, user:req.user });
      
    })
    .catch(error=>{
        console.log(error)
        res.status(500).send({
            success:0,
            error:error
        })
    })
}

exports.getUserByTwitteHandle = function(req, res){
    var twitterHandle = req.params.enctwitterhandle.toUpperCase();
    database.db.oneOrNone('select * from users where UPPER(twitterhandle) = $1', twitterHandle)
    .then(data=>{
      
        if(data){
                res.status(200).send({
                    success:1,
                    data:data
                })
        }
        else{
            res.status(200).send({
                success:1,
                data:null

            })
        }
    }).catch(err =>{
        console.log("error : ",err)
        if(err){
            res.status(500).send({
                success:0,
                msg:err
            })
        }
    })
    
}
exports.getUserById = function(req,res){
    database.db.oneOrNone('select * from users where id = $1', req.params.id)
    .then(data=>{
        if(data){
            res.status(200).send({
                success:1,
                data:data
            })
        }
    }).catch(err =>{
        console.log("error : ",err)
        if(err){
            res.status(500).send({
                success:0,
                msg:err
            })
        }
    })
}



exports.authenticate = function(req, res) {
    database.db.oneOrNone('select * from users where email = $1', req.body.email)
    .then( function(user) {
      
      if (!user) {
        res.status(401).send({ success: 0, message: 'Authentication failed. User not found.' });
      } else {
        // Check if password matches
        
          if (req.body.password === user.password) {
            // Create token if the password matched and no error was thrown
            user_modified={
                unsername:user.unsername,
                password: user.password,
                email: user.email,
                profilepic: user.profilepic,
                data:user.date,
                payment:user.payment,
                id:user.id

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
    .catch(function(err){
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
            .then(function(data){
                if(!data){
                    database.db.none('insert into users(username, password, email, profilepic,date, payment, id)' +
                        'values(${name}, ${password}, ${email},${profilepic},${date},${payment},${id})',
                        {
                            name: personInfo.name,
                            password: personInfo.password,
                            email: personInfo.email,
                            profilepic: personInfo.img,
                            date: personInfo.datetime,
                            payment: 0,
                            id:rn(options),
                          
                            
                        }).then(()=>{
                            // console.log("successfully created")
                            res.status(200).send({"success":1,msg:"successfully created"})
                        })
                        .catch((err)=>{
                            res.send({success:0,"err":err})
                        }
                    )

                }
                else{
                    res.send({success:0, msg:"the email already exists"})
                }
            })

        }
        else{
            res.send({success:0, msg:"passwords do not match"})
        }

    }
}
