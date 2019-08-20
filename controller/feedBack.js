

const config  = require('../config/keys');
var database = require('../app');

exports.saveFeedBackFiles =(req,res)=>{
    console.log(req.files);
    if (!req.files) {
        console.log("no file found in the request")
        return res.status(451).send({
            success: 0,
            msg:"no file found in the request"
        })
    }
    else if (req.files) {
        if(typeof req.fileSizeError != "undefined") {
            res.status(413).send({
                "success":0,
                "error":"File too large"});// to display filesize error
        } else {
            videopathName =    config.domain + '/public/audio/' + req.files[0].filename ;
            res.status(201).send({
                success:1,
                filename : videopathName
            })
        }
    }
    else{
        res.status(500).send({
            success:0,
        })
    }
}

exports.saveFeedBack = (req,res)=>{
      database.db.oneOrNone('insert into feedback(userid,experience,usability, suggestion,videofilepath)' +
      'values(${userid},${experience},${usability},${suggestion},${videofilepath})',
      {
        userid:req.body.userid,
        experience:req.body.experience,
        usability:req.body.usability,
        suggestion:req.body.suggestion,
        videofilepath:req.body.videofilepath,
    }).then(data=>{
        res.status(201).send({
            success:1,
        })
    }).catch(error=>{
        console.log("feedbackjs : saveFeedBAck : error : ",error);
        res.status(500).send({
            success:0,
            error:error
        })
    })
}

exports.getFeedBackById = (req,res)=>{
    database.db.oneOrNone('select * from feedback where id= $1',req.params.id)
    .then(function(data){
        console.log("contacts : ",data)
        if(data!==null)
            res.status(200).send({
                success:1,
                data:data
            })
        else{
            res.send(200).send({
                success:0,
                data:null
            })
        }
    })
    .catch(function(error){
        console.log("feedback.js : getFeedBackById : error : ",error)
        res.status(500).send({
            success:0,
            error:error
        })
    })

}

exports.getAllFeedBack = (req,res)=>{
    database.db.manyOrNone('select * from feedback')
    .then(function(data){
        res.status(200).send({
            success:1,
            data:data
        })
    }).catch(function(error){
        console.log("feedback.js : getAllFeedBack : error : ",error)
        res.status(500).send({
            success:0,
            error:error
        })
    })
}

exports.getMyFeedBack = (req,res)=>{
    database.db.manyOrNone('select * from feedback where userid = $1',req.user.id)
    .then(function(data){
        console.log("data : ",data)
        if(data!==null)
            res.status(200).send({
                success:1,
                data:data
            })
        else{
            res.status(200).send({
                success:0,
                data:null
            })
        }
    })
    .catch(function(error){
        console.log(" feedback.js : getMyFeedBack : error : ",error)
        res.status(500).send({
            success:0,
            error:error
        })
    })
}