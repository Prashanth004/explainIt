var Twitter = require('twitter');
var id = null
var client = new Twitter({
    consumer_key: 'Auz3a4BeVAVKRcO1ZVvRvbJDa',
    consumer_secret: 'FDBIlsYilBeoAi2vZyZubM0qFEPtJeaPoPVQ6ki2g2M9xqTTiA',
    access_token_key: '1090895508699176960-dwE2I31URS2FFnctXJmcWzL75Des6o',
    access_token_secret: 'LCEHpUBTU4yxMY5YYJxPKI8A6eVqoIJehImLYByU9HhB1'
  });

 
  // client.get('users/show.json', {"screen_name":'Sirivanth4'}, function(error,body ,response){
  //     console.log("body : ", body)
  //     id = body.id
  //   //   window.open("https://twitter.com/messages/compose?recipient_id="+id, target="_blank")
  // });
  client.post('statuses/update', {status: 'I am a tweet'}, function(error, tweet, response) {
    if (!error) {
      console.log(tweet);
    }
  });

  