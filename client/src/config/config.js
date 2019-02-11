
var today = new Date();
var date = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();

var time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
var token = JSON.parse(localStorage.getItem("token"))

const conf = {
    base_dir:"http://localhost:9000/api",
    react_url:"http://localhost:3000",
    dataTime : date+"__"+time,
    token:token,
    googleClientId:"308795475823-1uvk577becdqe5dpekouia3juuu961f8.apps.googleusercontent.com",
    peerHost:'127.0.0.1',
    peerPort : 9000,
    peerPath : '/peerjs'

    
}
export default conf