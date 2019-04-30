
const oauthSignature  = require('oauth-signature')
const request = require('request')

var   oauth_consumer_key ='Auz3a4BeVAVKRcO1ZVvRvbJDa'
var oauth_token = '1090895508699176960-dwE2I31URS2FFnctXJmcWzL75Des6o';
var oauth_timestamp = Math.round((new Date()).getTime() / 1000.0);
var httpMethod = 'GET',
    url = 'https://api.twitter.com/1.1/users/lookup.json',
    parameters = {
      
        screen_name : 'Sirivanth4',
    },
    header = {
        oauth_consumer_key : oauth_consumer_key,
        oauth_token : oauth_token,
        oauth_nonce : 'kglsdo9940pd9333jh',
        oauth_timestamp : oauth_timestamp,
        oauth_signature_method : 'HMAC-SHA1',
        oauth_version : '1.0',
    }
    
    signature = oauthSignature.generate(httpMethod, url, parameters, header, 
        { encodeSignature: false});
    console.log('signature : ',signature)

var option = {
    method:'GET',
    url : 'https://api.twitter.com/1.1/users/lookup.json?screen_name=Sirivanth4',
    header :{
        authorization:{
            "OAuth oauth_consumer_key":oauth_consumer_key,
            "oauth_nonce" : 'kglo9940pd9333jh',
            "oauth_signature" :signature,
            "oauth_signature_method":"HMAC-SHA1", 
            "oauth_timestamp":oauth_timestamp,
            "oauth_version":"1.0"
        }
    }

}
function callback(error, response, body) {
    console.log(body)
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
    console.log("info : ",info)
    }
    if(error){
        console.log("error : ",error)
    }
  }


request(option, callback);




