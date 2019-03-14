var database = require('../app')
var promise = require('bluebird');


exports.saveMessage = function (req, res) {
    console.log(req)
    console.log("req.body : ", req.body)
    let dateNow = new Date().toString()
    database.db.oneOrNone('insert into message (link,subject,fromuser, touser,time)' +
    'values(${link},${subject}, ${fromuser}, ${touser}, ${time})',
    {
        link: req.body.link,
        subject:req.body.subject,
        fromuser: req.body.fromUser,
        touser:req.body.touser,
        time : dateNow
    }).then(function(data){
        res.status(201).send({
            success:1,
            data:data
        })
    }).catch(function(error){
        console.log(error)
        res.status(500).send({
            success:0,
            error:error
        })
    })

}

exports.getMessage = function(req, res){
    database.db.manyOrNone('select * from message where touser = $1', req.params.userid)
    .then(data=>{
        console.log("data : ",data)
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