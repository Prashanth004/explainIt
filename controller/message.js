var database = require('../app')
var userController = require('./user.js')

var rn = require('random-number');
const config = require('../config/keys')
var options = {
    min: 0
    , max: 10000000
    , integer: true
}


exports.checkReplyInfo = (req, res) => {
    database.db.manyOrNone('select * from projects where email =$1 and issueid =$2', [req.user.email, Number(req.params.issueid)])
        .then(data => {
            if (data) {
                if (data.length == 0) {
                    res.status(200).send({
                        success: 1,
                        msg: "no data found"
                    })
                }
                else {
                    res.status(200).send({
                        success: 0,
                        data: data
                    })
                }
            }
            else {

                res.status(200).send({
                    success: 1,
                    mag: "no data found"
                })
            }
        })
        .catch(err => {
            console.log("message.js : checkReplyInfo : error : ", err)
            res.status(200).send({
                success: 0,
                error: err
            })

        })
}

exports.getUnreadNumber = (req, res) => {
    database.db.manyOrNone('select * from activities where unread =$1 and touser=$2',
        [1, req.user.id])
        .then(data => {
            if (data !== null) {
                res.status(200).send({
                    success: 1,
                    number: data.length
                })
            }
            else {
                res.status(200).send({
                    success: 1,
                    number: 0
                })
            }
        })
        .catch(error => {
            console.log("message.js : getUnreadNumber : error : ", error)
            res.status(500).send({
                success: 0,
                error: error
            })
        })
}
exports.changeUnread = (req, res) => {

    // update projects SET public = $1 
    // database.db.oneOrNone('insert into message (id,link,subject,fromuser, touser,time,unread)' +
    // 'values(${id},${link},${subject}, ${fromuser}, ${touser}, ${time},${unread})',
    database.db.none('update activities SET unread = $1 WHERE touser = $2 and id= $3', [0, req.user.id, req.params.messageid])
        .then(data => {
            res.io.emit(config.UPDATE_BADGE, {
                "userId": req.user.id
            })
            res.status(200).send({
                success: 1,
                data: data
            })

        })
        .catch(error => {
            console.log("message.js : changeUnread: error ", error)
            res.status(500).send({
                success: 0,
                error: error
            })
        })


}

exports.replyaction = (req, res) => {
    var subject = "";
    var creatorEmail = "";
    var creatorUserName = "";
    var replierUserNamer = "";
    var replierTwitterhandle = "";

    var MailSubject = "Notification for reply to your Recording"
    var issueId = req.body.issueid;
    //fetching project details
    database.db.oneOrNone('select * from projects where issueid = $1 and isQuestion = $2', [issueId, "true"])
        .then(data1 => {
            if (data1) {
                subject = data1.textexplain;
                creatorEmail = data1.email
                //fetching creators details
                database.db.oneOrNone('select * from users where email = $1', creatorEmail)
                    .then(data2 => {
                        if (data2) {
                            var link = config.frontEndDomain + "/project/" + issueId
                            creatorUserName = data2.username
                            //fetching replire details
                            database.db.oneOrNone('select * from  users where id = $1', req.body.replierId)
                                .then(data3 => {
                                    if (data3) {
                                        replierUserNamer = data3.username
                                        replierTwitterhandle = data3.twitterhande
                                        var htmlContent = "<p>hi " + creatorUserName + ",</p><br/><p> @" + replierTwitterhandle + " has replied to your recording with subject '" +
                                            subject + "'</p><br/> <a href='" + link + "'>click here</a>"
                                        userController.sendEmail(creatorEmail, MailSubject, htmlContent)
                                    }
                                    else {
                                        res.status(500).send({
                                            success: 0,
                                            msg: config.FAILED_TO_GET_REPLIER_DETAILS
                                        })
                                    }
                                })
                                .catch(error => {
                                    console.log("message.js : replyActions : error : ", error)
                                    res.status(500).send({
                                        success: 0,
                                        error: error,
                                        msg: config.FAILED_TO_GET_REPLIER_DETAILS
                                    })
                                })
                        }
                        else {
                            res.status(500).send({
                                success: 0,
                                msg: config.FAILED_TO_GET_CREATOR_DETAILS
                            })
                        }
                    })
                    .catch(error => {
                        console.log("message.js : replyAction : select users form email : error : ", error)
                        res.status(500).send({
                            success: 0,
                            error: error,
                            msg: config.FAILED_TO_GET_CREATOR_DETAILS
                        })
                    })
            }
            else {
                res.status(500).send({
                    success: 0,

                    msg: config.FAILED_TO_GET_ISSUE_DETAILS
                })
            }
        })
        .catch(error => {
            console.log("message.js : replyAction : getProject of an issue : error : ", error)
            res.status(500).send({
                success: 0,
                error: error,
                msg: config.FAILED_TO_GET_ISSUE_DETAILS
            })
        })
}




exports.saveMessage = function (req, res) {

    var rand = rn(options)
    var unreadDefault = 1
    let dateNow = new Date().toString()
    database.db.oneOrNone('insert into activities (fromuser,touser,activity,subject,link,duration,unread)' +
        'values (${fromuser},${touser},${activity}, ${subject}, ${link},${duration},${unread}) RETURNING id',
        {
            fromuser: req.user.id,
            touser: req.body.touser,
            activity: req.body.activity,
            subject: req.body.subject,
            link: req.body.link,
            duration: null,
            unread: unreadDefault
        }).then(data => {
            database.db.oneOrNone('select * from activities where id = $1',data.id)
                .then(data => {
                    res.io.emit(config.NEW_MESSAGE, {
                        "touser": req.body.touser,
                        "fromuser": req.user.id,
                        "data": data
                    })
                }).catch(error => { console.log("message.js : saveMessageerror : error ", error) });

            res.status(201).send({
                success: 1,
                data: data
            })

            database.db.oneOrNone('select * from users where id = $1', req.body.touser)
                .then(toData => {
                    if (toData) {
                        database.db.oneOrNone('select * from users where id = $1', req.body.fromUser)
                            .then(fromData => {

                                if (fromData) {

                                    var subject = "Message notification";
                                    var htmlContent = "<p>You have got a new recorded message from @" + fromData.twitterhandle + ".</p><br/><p><a href='" + req.body.link + "'>click here</a> to view</p>"
                                    userController.sendEmail(toData.email, subject, htmlContent)
                                }
                                else {
                                    res.status(500).send({
                                        success: 0
                                    })
                                }

                            })
                            .catch(err => {
                                console.log("message.js : saveMessage : error : ", err);
                                res.status(500).send({
                                    success: 0,
                                    error: err
                                })
                            })
                    }
                    else {
                        res.status(500).send({
                            success: 0
                        })
                    }
                })
                .catch(err => {
                    console.log("message.js : saveMessage : error : ", err);
                    res.status(500).send({
                        success: 0,
                        error: err
                    })
                })


        }).catch(function (error) {
            console.log("message.js : saveMessage : error : ", error)
            res.status(500).send({
                success: 0,
                error: error
            })
        })


}

exports.getMessage = function (req, res) {
    database.db.manyOrNone('select * from message where touser = $1 ORDER BY time', req.params.userid)
        .then(data => {
            if (data) {
                res.status(200).send({
                    success: 1,
                    data: data
                })
            }
            else {
                res.status(200).send({
                    success: 0,
    
                })
            }
        }).catch(err => {
            console.log("message.js : getMessage : error : ", err)
                res.status(500).send({
                    success: 0,
                    msg: err
                });
        })

}