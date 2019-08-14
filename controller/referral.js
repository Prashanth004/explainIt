
var database = require('../app')

var config = require('../config/keys')


exports.createReferral = (req,res)=>{
    database.db.one('insert into referral (problemowner, referrer, referreetwitter,referreeid, issue)'+
    'values(${problemowner},${referrer}, ${referreetwitter}, ${referreeid},${issue}) RETURNING id',
    {
        problemowner:req.body.problemOwner,
        referrer:req.body.referrer,
        referreetwitter:req.body.referreetwitter,
        referreeid:req.body.referreeid,
        issue:req.body.issue
    }).then(data=>{
        console.log("data : ",data)
        res.status(201).send({
            success:1,
            data:data
        })
        database.db.one('select * from referral where id = $1',data.id)
        .then(data1=>{
            console.log("data : ",data1)
            res.io.emit(config.NEW_MESSAGE, {
                "touser": data1.referrer,
                "fromuser":data1.problemowner,
                "data" :data1
            })
        })
    }).catch(error=>{
        console.log("referal saving error : ",)
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

