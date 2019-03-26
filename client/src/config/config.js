
var today = new Date();
var date = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();

var time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
var token = JSON.parse(localStorage.getItem("token"))

const conf = {
    base_dir:"http://localhost:9000",
    react_url:"http://localhost:3000",
    dataTime : date+"__"+time,
    token:token,
    googleClientId:"308795475823-1uvk577becdqe5dpekouia3juuu961f8.apps.googleusercontent.com",
    peerHost:'127.0.0.1',
    peerPort : 9000,
    peerPath : '/peerjs',
    gitHubClientId:"5c7162c1bd8449fa8b00",
    gitHubClientSecret:"2dc2241f50794c71ded61545fd3d34cfc4338947",
    react_url_git:"https://explain.bookmane.in/git",
    canvBackground : "rgb(205, 243, 224)",
    peopleDisplayLength:8,
    null:"null",
    EXTENSION_ID:"ljknohkmbbnpfpcpgaihbmiagabhinhl",
    EXTENSION_URL:"https://chrome.google.com/webstore/detail/explain/ljknohkmbbnpfpcpgaihbmiagabhinhl?authuser=2",
    SECRET : "thebookmaneisawesomeiguess",
    LINK_TO_CALL: "linkTocall",
    REJECT_REPLY:"rejectRepply",
    REPLY_TO_SHARE_REQ:"Please send me the recoding.",
    CALL_ACK_MESSAGE : "callAckMessage",
    END_CALL : "endCall",
    CHECK_TOKEN_VALIDITY : "checkTokenValidity",
    COMFIRM_TOKEN_VALIDITY : "confirmTokenValidity",
    RETRYCALL : "reTryCall",
    ENDCALL_ACK:"endCallAck",
    CLOSE_NETWORK_ISSUE : "closeDueToNetworkIssue",
    SELF :"home",
    VISIT_PROF : "notHome"


    
}
export default conf