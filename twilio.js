const accountSid = 'AC8d7469986378f515f067713f1fc5c5d7';
const authToken = 'aecba277f6238855c2858fae1ed1177f';
// const client = require('twilio')(accountSid, authToken);

// client.tokens.create().then(token => {
//     console.log("kjksj");
//     console.log(token.username);
// });

// const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
// const authToken = 'your_auth_token';
// const client = require('twilio')(accountSid, authToken);

// client.api.accounts.create().then(account => console.log(account));

// { authToken: '38b54de76ee42a78d63103409249888e',
//   dateCreated: 2019-07-03T07:46:06.000Z,
//   dateUpdated: 2019-07-03T07:46:06.000Z,
//   friendlyName: 'SubAccount Created at 2019-07-03 00:46 AM',
//   ownerAccountSid: 'AC8d7469986378f515f067713f1fc5c5d7',
//   sid: 'AC4a076a75ca3f52921e7fe4b0c6a943f9',
//   status: 'active',
//   subresourceUris:


function checkTURNServer(turnConfig, timeout){ 

    return new Promise(function(resolve, reject){
  
      setTimeout(function(){
          if(promiseResolved) return;
          resolve(false);
          promiseResolved = true;
      }, timeout || 5000);
  
      var promiseResolved = false
        , myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection   //compatibility for firefox and chrome
        , pc = new myPeerConnection({iceServers:[turnConfig]})
        , noop = function(){};
      pc.createDataChannel("");    //create a bogus data channel
      pc.createOffer(function(sdp){
        if(sdp.sdp.indexOf('typ relay') > -1){ // sometimes sdp contains the ice candidates...
          promiseResolved = true;
          resolve(true);
        }
        pc.setLocalDescription(sdp, noop, noop);
      }, noop);    // create offer and set local description
      pc.onicecandidate = function(ice){  //listen for candidate events
        if(promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('typ relay')>-1))  return;
        promiseResolved = true;
        resolve(true);
      };
    });   
  }