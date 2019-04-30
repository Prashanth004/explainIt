var database = require('../app')
var promise = require('bluebird');
var config = require('../config/keys')
var key = require('../config/keys')
var rn = require('random-number');
var options = {
    promiseLib: promise
};

var optionsRand = {
    min:  -10000000
  , max:  10000000
  , integer: true
  }



  exports.saveIssue = function(req,res){
      var projectId = null

    var dateNow = new Date().toString()

            var rand =  rn(optionsRand)
            if(req.body.projectId){
                projectId = req.body.projectId
            }
            database.db.oneOrNone('insert into issues(title,email,id, date, question)' +
            'values(${title},${email}, ${id}, ${date},${question})',
            {
                title: req.body.issueTitle,
                email:req.user.email,
                id: rand,
                date:dateNow,
                question:req.body.question,
              
            }).then(function(data){
                database.db.one('select * from issues where id = $1', rand)
                .then(data=>{
                    res.status(201).send({
                        success:1,
                        data: data
    
                    })
                    
                })
              

            }).catch((err)=>{
                res.status(500).send({
                    success:0,
                    error:err
                })
            })
  }

  exports.getOneIssue = function(req,res){
    database.db.oneOrNone('select * from issues  where id = $1',req.params.id)
    .then(data=>{
        res.status(200).send({
            success:1,
            msg:data
        })
  }).catch(function(err){
      res.status(500).send({
          success:0,
          error: err
      })
  })
}

exports.getAllIssues = function (req, res) {
    isTrue = "true"
    database.db.manyOrNone('select * from projects where isquestion = $1', isTrue)
        .then(data => {
            res.status(200).send({success:1,data:data})
        })
        .catch(error =>{
            res.status(500).send({success:0, msg:error})
        })
        

}


