
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