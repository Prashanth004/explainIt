var promise = require('bluebird');
var fs = require('fs');
var config = require('../config/keys')
var key = require('../config/keys')
var shell = require('./shellHelper');
// var exec = require('child_process').execFile;
var options = {
    promiseLib: promise
};
var database = require('../app')
var rn = require('random-number');
var options = {
    min: -1000000
    , max: 10000000
    , integer: true
}

id: rn(options),


    exports.editReason = (req, res) => {
        database.db.none('update projects SET textexplain =$1 WHERE projectid =$2', [req.body.title, req.body.projectid])
            .then(data => {
                database.db.oneOrNone('select * from projects where projectid=$1', req.body.projectid)
                    .then(data => {
                        res.status(200).send({
                            success: 1,
                            data: data
                        })
                    })

            })
            .catch(err => {
                console.log(err)
                res.status(500).send({
                    success: 1,
                    error: err
                })
            })
    }

exports.updateProjectpublic = function (req, res) {
    database.db.none('update projects SET public = $1 WHERE projectid = $2', [1, req.body.projectId])
        .then(data => {
            res.status(200).send({
                success: 1,
                data: data
            })
        })
        .catch(err => {
            console.log("error : ", err)
            res.status(500).send({
                success: 0,
                msg: err
            })

        })
}

exports.updateProjectprivate = function (req, res) {
    database.db.none('update projects SET public = $1 WHERE projectid = $2', [0, req.body.projectId])
        .then(data => {
            res.status(200).send({
                success: 1,
                data: data
            })
        })
        .catch(err => {
            console.log("error : ", err)
            res.status(500).send({
                success: 0,
                msg: err
            })

        })
}


exports.saveProject = function (req, res) {
    var videopathName = null;
    var commands = null;
    console.log(req.user)
if (!req.files) {
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
     
        if(req.body.action === key.SERVER_SHARING)
        {
        if(key.DEV_ENV)
        {
        commands = [
            'ffmpeg -i ' + __dirname + '\\..\\public\\audio\\' + req.files[0].filename +' '+req.files[0].filename+'audio.mp3',
            'ffmpeg -i '+ __dirname + '\\..\\public\\audio\\' + req.files[1].filename +' -i '+req.files[0].filename+'audio.mp3 -filter_complex amerge -c:a libmp3lame -q:a 4 '+ req.files[1].filename +'audiofinal.mp3',
            'ffmpeg -i ' + __dirname + '\\..\\public\\audio\\' + req.files[0].filename +' -i '+ req.files[1].filename +'audiofinal.mp3 -map 0:v -map 1:a -c copy -y ' + __dirname + '\/..\/public\/audio\/' + req.body.projectName + '_final.mkv'
        ]
        }
        else {
            commands = [
                'ffmpeg -i ' + __dirname + '\/..\/public\/audio\/' + req.files[0].filename +' '+req.files[0].filename+'audio.mp3',
                'ffmpeg -i '+ __dirname + '\/..\/public\/audio\/' + req.files[1].filename +' -i '+req.files[0].filename+'audio.mp3 -filter_complex amerge -c:a libmp3lame -q:a 4 '+ req.files[1].filename +'audiofinal.mp3',
                'ffmpeg -i ' + __dirname + '\/..\/public\/audio\/' + req.files[0].filename +' -i '+ req.files[1].filename +'audiofinal.mp3 -map 0:v -map 1:a -c copy -y ' + __dirname + '\/..\/public\/audio\/' + req.body.projectName + '_final.mkv'
            ]
        }
        shell.series(commands, function(err){
                fs.unlink(__dirname+'/../'+ req.files[0].filename +'audio.mp3', (err)=>{
                    if(err) console.log("err : ",err)
                })
                fs.unlink(__dirname+'/../'+ req.files[1].filename +'audiofinal.mp3', (err)=>{
                    if(err) console.log("err : ",err)
                })
            if(!err){
                videopathName = config.domain + '/public/audio/' + req.body.projectName + '_final.mkv'
                saveToDb(req,res, videopathName )
                
//adonsdovjn
            }
            else{
                console.log("error : ",err)
                res.status(500).send({ success: 0, msg: err })
            }
        });
    }
    else{
            videopathName =   videopathName = config.domain + '/public/audio/' + req.files[0].filename 
            saveToDb(req,res, videopathName )
    }
    }
}
}


const saveToDb = (req, res, videopathName)=>{
    var rand2 = rn(options)
    // const issueID = (req.body.isquestion == "true" || req.body.issueID == null) ?
    //     (rand2) : (req.body.issueID);
    var imgurl = config.domain + '/images/default.png';
    var rand = rn(options)
    database.db.oneOrNone('insert into projects(name,email, projectid,  textExplain ,issueid,isquestion, imgurl,videofilepath,public)' +
        'values(${name},${email}, ${projectid},${textExplain},${issueid},${isquestion},${imgurl},${videofilepath},${public})',
        {
            name: req.body.projectName,
            email: req.user.id,
            projectid: req.body.projectid,
            imgurl: imgurl,
            textExplain: req.body.textExplain,
            isquestion: req.body.isquestion,
            issueid: req.body.issueID,
            videofilepath: videopathName,
            public: Number(req.body.public)
        }).then((response) => {
            database.db.one('select * from projects where projectid = $1', req.body.projectid)
                .then(data => {
                    res.io.emit(key.SAVED_NEW_PROJECT, {
                        "userId": req.user.id
                    })
                    res.status(201).send({
                        success: 1,
                        data: data
                    })
                })
        }).catch((err) => {
            console.log("error : ", err)
            res.status(500).send({ success: 0, msg: "some error occured while saving you idea. Please try again agter some time" })
        })
}

exports.storeItems = function (req, res) {
    projectid = ""
    database.db.oneOrNone('select * from projects where name = $1', req.body.projectName)
        .then(data => {
            projectid = data.projectid
            database.db.oneOrNone('insert into canvitems (projectid,items)' + 'values(${projectid},${items})', {
                projectid: projectid,
                items: req.body.items
            }).then(data => {
                res.status(200).send({
                    success: 1,
                    msg: "data successfullt stored"
                })
            }).catch(err => {
                console.log("not success full... error : " + err)
                res.status(500).send({
                    success: 0,
                    msg: err
                })
            })
        }
        )
}

exports.deleteItems = function (req, res) {
    database.db.query('delete from projects where issueid = $1', req.params.issueid)
        .then(data => {
            res.status(200).send({
                success: 1,
                msg: data
            })
        })
        .catch(err => {
            console.log("error : ", err)
            res.status(500).send({
                success: 0,
                msg: err
            })
        })
}

exports.retrieveItems = function (req, res) {
    database.db.oneOrNone('select * from canvitems  where projectid = $1', req.params.id)
        .then(data => {
            res.status(200).send({
                success: 1,
                msg: data
            })
        }).catch(err => {
            console.log("not success full... error : " + err)
            res.status(500).send({
                success: 0,
                msg: err
            })
        }
        )

}

exports.getAllProject = function (req, res) {
    database.db.manyOrNone('select * from projects ORDER BY date ASC')
        .then(data => {
            res.status(200).send({ success: 1, data: data })
        })
        .catch(error => {
            res.status(500).send({ success: 0, msg: error })
        })


}
exports.getIssueById = function (req, res) {

    database.db.one('select * from projects where issueid = $1', req.params.id)
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
exports.getProjectById = function (req, res) {

    database.db.one('select * from projects where projectid = $1 ', req.params.id)
        .then(projects => {
            res.status(200).send({
                success: 1,
                data: projects
            })
        })
        .catch(error => {
            res.status(500).send({
                sucess: 0,
                msg: error
            })
        })
}


exports.getAllProjectByIssue = function (req, res) {
    database.db.manyOrNone('select * from projects where issueid = $1 ORDER BY date ASC', req.params.issueid)
        .then(projects => {
            if(projects.length !== 0)
            {
                if (projects) {
                    res.status(200).send({
                        success: 1,
                        data: projects
                    })
                }
            }
            else{
                res.status(500).send({
                    success:0,
                    errors:err
                })
            }
           

        })
        .catch(err=>{
            res.status(500).send({
                success:0,
                errors:err
            })
        })
}



function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

