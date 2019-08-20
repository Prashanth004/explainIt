var Twitter = require('twitter');
var id = null
var database = require('../app')
const client = new Twitter({
    consumer_key: '13FbniOUPv6B1QNBpV8mxtYwh',
    consumer_secret: 'Yju3DJjiWkAr6WoxiqD2UkVQOxnCZVTGcekZBxU0Xg64rCCDc5',
    access_token_key: '1090895508699176960-QqF7yJ4coLzo0nMnVXim5ZU47d0Tds',
    access_token_secret: 'CBIi0ipduhdLRJNUQRUZsT0wCLKuMGpwzkb7nR8PKx3Qc'
  });

  exports.getid = function (req, res) {
    //   console.log("req.body.twitterhandle : ",req.body.twitterhandle)
     var params = {
        "screen_name":req.body.twitterhandle
     }
      client.get('users/show.json', params, function(error,body ,response){

         if(error!==null){
            console.log("tweetActions : getid : error : ",error)
            res.status(200).send({
                success:0,
            })
         }  
        
         else{
            var newProfilePic = body.profile_image_url_https.replace("_normal","")
            res.status(200).send({
                success:1,
                id:body.id_str,
                profilePic : newProfilePic,
                name: body.name
            })
            if(req.body.id!== undefined || req.body.id!== null ){
            database.db.manyOrNone('select * from usertwitter where userid = $1 and twitterhandle = $2',[req.body.id,req.body.twitterhandle])
            .then(data=>{
                if(data.length=== 0){
                    database.db.oneOrNone('insert into usertwitter (twitterhandle, userid,profilepic,twitterid)'+
                    'values(${twitterhandle}, ${userid},$(profilepic),$(twitterid))',
                    {
                        twitterhandle:req.body.twitterhandle,
                        userid:req.body.id,
                        profilepic:newProfilePic,
                        twitterid:body.id_str
                    })
                    .then(data=>{
                    })
                    .catch(error=>{
                        console.log("error : ",error )
                    })
                }
                else{
                }
            })
            .catch(err=>{
                console.log("error in checking if present : ", err)
            })
        }
        else{
        }
        }
     });

  }


  exports.tweetRecoding = (req,res)=>{
      var err = false
      RecieverTwitterHande = req.body.rectwiHandle;
      callerTwitterHande =  req.body.caltwiHandle;
      recordAccessLink =  req.body.LinktoAccess
      statusCaller ="@"+callerTwitterHande+" You were in video call with "
      +RecieverTwitterHande+". This is the link to access the recording. "+
      recordAccessLink

      statuReciever ="@"+RecieverTwitterHande+" You were in video call with "
      +callerTwitterHande+". This is the link to access the recording. "+
      recordAccessLink

    client.post('statuses/update', {status: statusCaller}, function(error1, tweet, response) {
        if (!error1) {
          client.post('statuses/update', {status: statuReciever}, function(error2, tweet, response) {
            if (!error2) {
                res.status(200).send({
                    success:1,
                    msg:"tweetAction failed"
                })
            }
            else{
                res.status(500).send({
                    success:0,
                    msg:"tweetAction failed"
                })
                console.log("error : ",error1)
            }
            
          });
        }
        else{
            res.status(500).send({
                success:0,
                msg:"tweetAction failed"
            })

        }

      });
  }
  exports.getUserDetails = (req,res)=>{
      database.db.manyOrNone('select * from usertwitter  where twitterid = $1',req.params.twitterid)
      .then(data=>{
          console
          res.status(200).send({
              success:1,
              data:data
          })
      })
      .catch(error=>{
          console.log("error : ",error)
        res.status(500).send({
            success:0,
            msg:error
        })
      })
  }
  exports.twitterlist = (req, res)=>{
      const user = req.user.id
      database.db.manyOrNone('select * from usertwitter where userid = $1',user)
      .then(data=>{
          if(data){
              res.status(200).send({
                  success:1,
                  data:data
              })
          }
          else{
              res.status(200).send({
                  success : 1,
                  data:null
              })
          }
      })
      .catch(error=>{
          console.log("error : ", error);
          res.status(500).send({
              success:0,
              msg:error
          })
      })
  }