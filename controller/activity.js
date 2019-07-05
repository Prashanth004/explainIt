var database = require('../app')
var config = require('../config/keys');

exports.addActivity = (req,res)=>{
    unreadDefault = 1
    database.db.oneOrNone('insert into activities (fromuser,touser,activity,subject,link,duration,unread)'+
    'values (${fromuser},${touser},${activity}, ${subject}, ${link},${duration},${unread})',
{
    fromuser:req.user.id,
    touser:req.body.touser,
    activity:req.body.activity,
    subject:req.body.subject,
    link:req.body.link,
    duration:req.body.duration,
    unread:unreadDefault
}).then(data=>{
    
    res.io.emit(config.NEW_MESSAGE, {
        "fromuser":req.user.id,
        "touser": req.body.touser
       
    })
    res.status(201).send({
        success:1,
        data:data
    })
}).catch(error=>{
    console.log("error n saving activity: ",error)
    res.status(500).send({
        success:0,
        error:error
    })
})
}
exports.getAcitivies=(req,res)=>{
    database.db.manyOrNone('select * from activities where touser = $1 or fromuser = $2 ORDER BY id DESC',
    [String(req.user.id),String(req.user.id)])
    .then(data=>{
        res.status(200).send({
            success:1,
            data:data
        })
    }).catch(error=>{
        console.log("error : ",error)
        res.status(500).send({
            success:0,
            error:error
        })
    })
}

exports.getAllActivities=(req,res)=>{
    database.db.manyOrNone('select * from activities')
    .then(data=>{
        res.status(200).send({
            success:1,
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

exports.deleteActivity = (req,res)=>{
    database.db.none('delete from activities where id =$1',req.params.id)
    .then(data=>{
        res.status(200).send({
            success:1,
            data:data
        })
        .catch(error=>{
            res.status(500).send({
                success:0,
                error:error
            })
        })
    })
}
