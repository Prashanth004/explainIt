

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
            console.log("File too large")
            res.status(413).send({
                "success":0,
                "error":"File too large"});// to display filesize error
        } else {
            console.log("sending the file values")
            console.log(" req.files[0].filename : ",req.files[0].filename)
            videopathName =    config.domain + '/public/audio/' + req.files[0].filename ;
            res.status(201).send({
                success:1,
                filename : videopathName
            })
        }

    }
}

exports.saveFeedBack = (req,res)=>{
    console.log("req.body : ",req.body);
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
        console.log("error : ",error)
        res.status(500).send({
            success:0,
            error:error
        })
    })
}

exports.getFeedBackById = (req,res)=>{
    console.log("req.params.id : ",req.params.id);
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
        console.log("error : ",error)
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
        console.log("error : ",error)
        res.status(500).send({
            success:0,
            error:error
        })
    })
}

exports.getMyFeedBack = (req,res)=>{
    console.log("req.params.id : ",req.params.id);
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
        console.log("error : ",error)
        res.status(500).send({
            success:0,
            error:error
        })
    })
}