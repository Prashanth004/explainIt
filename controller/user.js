

var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config/keys')
var promise = require('bluebird');
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
exports.getUserByEmail = function(req,res){
    // console.log("req.params.email : ",req.params.email)
    database.db.oneOrNone('select * from users where email = $1', req.params.email)
    .then(data=>{
        // console.log("data : ",data)
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

exports.getUserByTwitteHandle = function(req, res){
    database.db.oneOrNone('select * from users where twitterhandle = $1', req.params.enctwitterhandle)
    .then(data=>{
      
        // console.log("data : ",data)
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
    // console.log("req.params.id : ",req.params.id)
    database.db.oneOrNone('select * from users where id = $1', req.params.id)
    .then(data=>{
        // console.log("data : ",data)
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
        // console.log(user)
      
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
