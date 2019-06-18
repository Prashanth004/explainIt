
var database = require('../app')




exports.createReferral = (req,res)=>{
    database.db.oneOrNone('insert into referral (problemowner, referrer, referreetwitter, issue)'+
    'values(${problemowner},${referrer}, ${referreetwitter},${issue})',
    {
        problemowner:req.body.problemOwner,
        referrer:req.body.referrer,
        referreetwitter:req.body.referreetwitter,
        issue:req.body.issue
    }).then(data=>{
        res.status(201).send({
            success:1,
            data:data
        })
    }).catch(error=>{
        res.status(500).send({
            success:0,
            error:error
        })
    })
}

exports.getReferralById = (req,res)=>{
    database.db.oneOrNone('select * from referral where id =$1',req.params.referralid)
    .then(projects => {
        res.status(200).send({
            success: 1,
            data: projects
        })
    })
    .catch(error => {
        console.log("error : ", error)
        res.status(500).send({
            sucess: 0,
            msg: error
        })
    })
}


exports.gatAllReferral = (req,res) =>{
    database.db.manyOrNone('select * from referral where problemowner =$1 or referrer =$1',String(req.user.id))
    .then(data=>{
        res.status(200).send({
            success:1,
            data:data
        })
    })
    .catch(error=>{
        res.state(500).send({
            success:0,
            error:error
        })
    })
}

