var Twitter = require('twitter');
var id = null


  exports.getid = function (req, res) {
    var client = new Twitter({
        consumer_key: 'Auz3a4BeVAVKRcO1ZVvRvbJDa',
        consumer_secret: 'FDBIlsYilBeoAi2vZyZubM0qFEPtJeaPoPVQ6ki2g2M9xqTTiA',
        access_token_key: '1090895508699176960-dwE2I31URS2FFnctXJmcWzL75Des6o',
        access_token_secret: 'LCEHpUBTU4yxMY5YYJxPKI8A6eVqoIJehImLYByU9HhB1'
      });
    
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
            res.status(200).send({
                success:1,
                id:body.id
            })
         }
         
        //   window.open("https://twitter.com/messages/compose?recipient_id="+id, target="_blank")
      });

  }