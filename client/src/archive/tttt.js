var storeToken = new Promise(function(resolve, reject){
    peer.on('call', function (call) {
       console.log("connection : ",call) 
            resolve(call)
       
    });
})

storeToken.then((call)=>{
    call.answer()
    call.on('stream', function(stream){
    console.log('Received', stream);
    var video = document.querySelector('#video');