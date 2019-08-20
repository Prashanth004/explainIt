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
    
    database.db.oneOrNone('select * from activities where link = $1',req.body.link)
    .then(data=>{
        res.io.emit(config.NEW_MESSAGE, {
            "touser": req.body.touser,
            "fromuser":req.user.id,
            "data" :data
        })
    }).catch(error=>{
        console.log("activity.js : addActivity : socket.emit : error : ",error);
        return
    })
    res.status(201).send({
        success:1,
        data:data
    })
}).catch(error=>{
    console.log("activity.js : addActivity : error : ",error)
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
        console.log("error : ",error);
        console.log("activities : getActivities ");
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
        console.log("activities.js : getAllActivities : error : ",error);
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
            console.log("activity.js : deleteActivity : error : ",error);
            res.status(500).send({
                success:0,
                error:error
            })
        })
    })
}