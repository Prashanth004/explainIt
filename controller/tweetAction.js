var Twitter = require('twitter');
var id = null
var database = require('../app')
const client = new Twitter({
    consumer_key: 'Auz3a4BeVAVKRcO1ZVvRvbJDa',
    consumer_secret: 'FDBIlsYilBeoAi2vZyZubM0qFEPtJeaPoPVQ6ki2g2M9xqTTiA',
    access_token_key: '1090895508699176960-dwE2I31URS2FFnctXJmcWzL75Des6o',
    access_token_secret: 'LCEHpUBTU4yxMY5YYJxPKI8A6eVqoIJehImLYByU9HhB1'
  });

  exports.getid = function (req, res) {
  
     var params = {
        "screen_name":req.params.twitterhandler
     }
      client.get('users/show.json', params, function(error,body ,response){

         if(error!==null){
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
            if(req.user!== undefined){
            database.db.manyOrNone('select * from usertwitter where userid = $1 and twitterhandle = $2',[req.user.id,req.params.twitterhandler])
            .then(data=>{
                if(data.length=== 0){
                    database.db.oneOrNone('insert into usertwitter (twitterhandle, userid)'+
                    'values(${twitterhandle}, ${userid})',
                    {
                        twitterhandle:req.params.twitterhandler,
                        userid:req.user.id
                    })
                    .then(data=>{
                    })
                    .catch(error=>{
                        console.log(error)
                    })
                }
                else{
                }
            })
            .catch(err=>{
                console.log("error in checking if present : ", err)
            })
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
            console.log("error : ",error1)
            res.status(500).send({
                success:0,
                msg:"tweetAction failed"
            })

        }

      });
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