var database = require('../app')
var userController = require('./user.js')

    var rn = require('random-number');
const config = require('../config/keys')
var options = {
    min: 0
    , max: 10000000
    , integer: true
}


exports.checkReplyInfo =( req, res)=>{
database.db.oneOrNone('select * from projects where email =$1 and issueid =$2',[req.user.email,Number(req.params.issueid)])
.then(data=>{
    if(data){
        if(data.length!==null){
            res.status(200).send({
                success:1,
                data : data
            })
        }
        else{
            res.status(200).send({
                success:0,
                msg:"no data found"
            })
        }
    }
    else{
        
        res.status(200).send({
            success:0,
            mag: "no data found"
        })
    }
})
.catch(err=>{
    console.log("error : ",err)
    res.status(200).send({
        success:0,
        error:err
    })

})
}

exports.getUnreadNumber=(req,res)=>{
    database.db.manyOrNone('select * from message where unread =$1 and touser=$2',[1,req.user.id])
    .then(data=>{
        if(data!==null){
            res.status(200).send({
                success:1,
                number: data.length
            })
        }
        else{
            res.status(200).send({
                success:1,
                number:0
            })
        }
    })
    .catch(error=>{
        res.status(500).send({
            success:0,
            error:error
        })
    })
}
exports.changeUnread = (req,res)=>{
   
    // update projects SET public = $1 
    // database.db.oneOrNone('insert into message (id,link,subject,fromuser, touser,time,unread)' +
    // 'values(${id},${link},${subject}, ${fromuser}, ${touser}, ${time},${unread})',
    database.db.none('update message SET unread = $1 WHERE touser = $2 and id= $3', [0, req.user.id, req.params.messageid])
    .then(data=>{
        res.io.emit(config.UPDATE_BADGE, {
            "userId":req.user.id
         })
        res.status(200).send({
            success:1,
            data:data
        })
        
    })
    .catch(error=>{
        console.log("error: ",error)
        res.status(500).send({
            success:0,
            error:error
        })
    })

     
}

exports.saveMessage = function (req, res) {
    
    var rand = rn(options)

    let dateNow = new Date().toString()
    database.db.oneOrNone('insert into message (id,link,subject,fromuser, touser,unread)' +
    'values(${id},${link},${subject}, ${fromuser}, ${touser},${unread})',
    {
        id:rand,
        link: req.body.link,
        subject:req.body.subject,
        fromuser: req.body.fromUser,
        touser:req.body.touser,
        unread : 1
    }).then(function(data){
        res.io.emit(config.NEW_MESSAGE, {
            "touser":req.body.touser
         })
        res.status(201).send({
            success:1,
            data:data
        })
        database.db.oneOrNone('select * from users where id = $1', req.body.touser)
        .then(toData=>{
            if(toData){
                database.db.oneOrNone('select * from users where id = $1', req.body.fromUser)
                .then(fromData=>{
                   
                    if(fromData){
                     
                        var subject = "Message notification";
                        var htmlContent = "<p>You have got a new recorded message from "+fromData.username+".</p><br/><p><a href='"+config.frontEndDomain+"'>click here</a> to view</p>"
                        userController.sendEmail(toData.email,subject,htmlContent)
                    }
                   
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        })
        .catch(err=>{
            console.log(err)
        })
        

    }).catch(function(error){
       // console.log(error)
        res.status(500).send({
            success:0,
            error:error
        })
    })

}

exports.getMessage = function(req, res){
    database.db.manyOrNone('select * from message where touser = $1 ORDER BY time', req.params.userid)
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