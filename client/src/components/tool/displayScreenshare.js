import React, { Component } from 'react'
import config from '../../config/config'
import RecordRTC from 'recordrtc'
import '../css/screenRecorder.css'
import '../css/shareScreen.css';
import '../css/call.css';
import Draggable from 'react-draggable';
import browser from 'browser-detect';
import CopyToClipboard from './CopytoClipboard'
import { saveExtensionDetails, saveSourceId } from "../../actions/extensionAction";
import { MdFilterNone } from "react-icons/md";
import { answerCall } from '../../actions/callAction'
import { connect } from 'react-redux';
import { MdCallEnd } from "react-icons/md";
import ProfileCard from './NewUi/ProfileHover'
import PropType from 'prop-types';
import socketIOClient from "socket.io-client";
import { stillAuthenicated } from '../../actions/signinAction';
import { getProfileByTwitterHandle } from "../../actions/visitProfileAction";

class DisplayShare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            peer: null,
            recorder: null,
            host: config.peerHost,
            port: config.peerPort,
            path: config.peerPath,
            stream: null,
            sharablelink:null,
            gotSharableLink:false,
            peerIdFrmPeer: null,
            isConnPreasent: false,
            conn: null,
            socket: null,
            clientPeerid: null,
            call: null,
            closedHere: false,
            showDisconectMessage: false,
            connected: false,
            myProfilePicture: null,
            peerProfilePic: null,
            callEnded: false,
            manualClose: false,
            isTokenValid: false,
            validCheckComplete: false,
            picture: null,
            twitterhandle: null,
            timerEnded: false,
            callerProfileId: null,
            isInstalled: true,
            secondVideoStream: null,
            initiatedScreenShare:false,
            myscreenSharing:false
        }
        this.closeConnection = this.closeConnection.bind(this);
        this.endCall = this.endCall.bind(this);
        this.shareScreen = this.shareScreen.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.startCall = this.startCall.bind(this);
        this.downloadExtension = this.downloadExtension.bind(this);

    }
     downloadExtension() {
    window.open(config.EXTENSION_URL)

  }
    closeWindow() {
        window.close();
    }

    componentDidMount() {
        var self = this
        const result = browser();
        if(config.ENVIRONMENT!=="test"){
        if (result.name === "chrome") {
            var img;
            img = new Image();
            img.src = "chrome-extension://" + config.EXTENSION_ID + "/icon.png";
            img.onload = function () {
            };
            img.onerror = function () {
                self.setState({
                    isInstalled: false
                })
            };
          }
        }
        var socket = this.state.socket;
        var peerIdFrmPeer = this.state.peerIdFrmPeer;
        function postMessageHandler(event) {
            console.log("event : ",event)
            if (event.data === 'rtcmulticonnection-extension-loaded') {
                console.log("saving the extension credentials")
                self.setState({
                    source: event.source,
                    origin: event.origin,
                    gotmessage: true
                })
                self.props.saveExtensionDetails(event.source, event.origin)
            }
            if (event.data.sourceId !== undefined) {
                console.log("got the source id")
                self.props.saveSourceId(event.data.sourceId)
                self.startCall()
            }
        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }
        setTimeout(() => {
            if (!self.state.validCheckComplete) {
                self.setState({
                    validCheckComplete: true,
                    isTokenValid: false
                })
            }
        }, 4000)
        socket.on('connect_failed', function() {
            document.write("Sorry, there seems to be an issue with the connection!");
         })
         socket.on('error', function (err) {
            console.log("err : ",err);
        });
        socket.on('connect_timeout', function (err) {
           console.log("ceonnection time out")
        });
        
        socket.on(config.SEND_SHARABLE_LINK, data=>{
             console.log("data : ",data)
            if(data.otherPeerId === self.state.peerIdFrmPeer){
                self.setState({
                    sharablelink:data.sharableLink,
                    gotSharableLink:true
                })
            }
        })
        
        socket.on(config.ACCEPT_SHARE_OTHRT_PEER_SCREEN,data=>{
            if(data.otherPeerId === self.state.peerIdFrmPeer){
                self.setState({
                    myscreenSharing:false
                })
            }
        })
        socket.on(config.CLOSE_NETWORK_ISSUE, data => {
            if (data.otherPeerId === self.state.peerIdFrmPeer) {
                self.closeConnection()
            }
        })

        socket.on(config.RETRYCALL, data => {

            if (data.peerId === self.state.peerIdFrmPeer) {
                self.peerConnections(socket,data.peerId)
                self.setState({
                    callEnded: false
                })
            }
        })
        socket.on(config.COMFIRM_TOKEN_VALIDITY, data => {
            if (data.success === 1) {
                self.setState({
                    validCheckComplete: true,
                    isTokenValid: true,
                    picture: data.profilePic,
                    twitterhandle: data.twitterHandle,
                    callerProfileId: data.id
                })
            }
        })
        socket.on(config.END_CALL, data => {
            if (data.peerId === peerIdFrmPeer && data.timerEnded) {
                self.closeConnection()
                self.setState({
                    timerEnded: true
                })
            }
            else if (data.peerId === peerIdFrmPeer && !data.timerEnded) {
                self.closeConnection()
                self.setState({
                    manualClose: true
                })
            }
            socket.emit(config.ENDCALL_ACK, {
                'clientId': self.state.clientPeerid,
                'encCallAck': true
            })

        })
    }

    componentWillMount() {
        const socket = socketIOClient(config.base_dir);
        this.setState({
            socket: socket
        })
        var peerIdFrmPeer = this.props.match.params.callerid;
        this.setState({  peerIdFrmPeer: peerIdFrmPeer})
        this.peerConnections(socket,peerIdFrmPeer);
        this.props.stillAuthenicated();
    }

    peerConnections(socket,peerIdFrmPeer) {
            this.setState({
            socket: socket
            });

        // var profilePic = (localStorage.getItem("profilePic"))
        // this.setState({
        //     peerProfilePic: profilePic
        // });
        this.props.answerCall()
        var peer = new window.Peer()
        var self = this
        this.setState({
            peer: peer
        });
        peer.on('open', function (id) {
            self.setState({
                clientPeerid: id,
                connected: true
            })
        });
        // var startConnection = new Promise((resolve, reject) => {
            var conn = peer.connect(peerIdFrmPeer);
            conn.on('open', function () {
           

                conn.on('data',data=>{
                    if(data.data ==="sendID"){
                        if(config.CALL_LOGS){
                            console.log("got connection acknowledge")
                            console.log("sending message")
                        }
                       
                        conn.send({
                            clientId: self.state.clientPeerid,
            
                        });
                    }
                })
               
               
            });

        // });
        // startConnection.then((conn=>{
            // 
           
        // }))

        peer.on('call', function (call) {
          
            navigator.mediaDevices.getUserMedia({ audio: true}).then(function(audiostream) {
                call.answer(audiostream)
                var recorder1 = RecordRTC(audiostream, {
                    type: 'audio'
                });
                recorder1.startRecording();
                self.setState({
                    recorder: recorder1
                })
                // var sendInterVal = setInterval(()=>{
                //     console.log('recorder1 : ', recorder1)

                //     if(self.state.callEnded)
                //     clearInterval(sendInterVal)
                //     socket.emit(config.UPDATE_RECORDER, {
                //         'clientId': self.state.clientPeerid,
                //         'recorder': recorder1
                //     })
                // },2000)
             
                if(config.CALL_LOGS)
                console.log("answering call..")
                call.on('stream', function (stream) {
                    socket.emit(config.CALL_ACK_MESSAGE, {
                        'clientId': self.state.clientPeerid,
                        'recieverProfilePic': self.props.myProfilePicture,
                        'recieverProfileName': self.props.myProfileName,
                        'recieverUserId': self.props.myProfileUserId
                    })
                    self.setState({
                        connected: false,
                        videoStream:stream
                    })
                    var divi = document.querySelector('.screenShareDiv')
                    divi.style.display = "block"
                    var video = document.querySelector('#video');
                    video.srcObject = stream
                 
                    setTimeout(() => {
                        video.play()
                    }, 1000)
                });

                call.on('close', function () {
                    if (!self.state.callEnded) {
                        self.closeConnection()
                    }
                    socket.emit(config.CLOSE_NETWORK_ISSUE, {
                        'otherPeerId': self.state.clientPeerid
                    })

                })
                self.setState({
                    stream: audiostream,
                    call: call
                })
            })
        })
        peer.on('close', () => {
            if (!self.state.callEnded) {
                self.closeConnection()
            }
            socket.emit(config.ENDCALL_ACK, {
                'clientId': self.state.clientPeerid,
                'encCallAck': true
            })
        })
        peer.on('disconnected', function () {
            if (!self.state.callEnded) {
                self.closeConnection()
            }
            socket.emit(config.ENDCALL_ACK, {
                'clientId': self.state.clientPeerid,
                'encCallAck': true
            })
        });

    }

    openLogin() {
        window.open(config.react_url + '/login')
    }
    endCall() {
        var call = this.state.call;
        this.setState({
            closedHere: true,
            manualClose: true
        })
        setTimeout(() => {
            call.close();
        }, 400)

        var socket = this.state.socket
        socket.emit(config.END_CALL, {
            'clientId': this.state.clientPeerid
        })
        this.closeConnection()
    }
    shareScreen() {
        var self= this;
        var socket = this.state.socket
        if(this.state.initiatedScreenShare){
            this.setState({
                myscreenSharing:true
            })
            socket.emit(config.ACCEPT_SHARE_OTHRT_PEER_SCREEN,{
                'otherPeerId': self.state.clientPeerid
            })
        }
        else{
     
        // var ua = window.detect.parse(navigator.userAgent);
        const result = browser();
        if (result.name === "chrome") {
            console.log("detected chome")
            if(config.ENVIRONMENT!=="test"){
            if (this.state.isInstalled) {
                self.receiveMessage()
            }
        }
        else{
            console.log("sending requesto recieve message")
            self.receiveMessage()
        }
        }
        else if (result.name === "firefox") {
            self.startCall()
        }
    }
    }
    receiveMessage() {
        console.log("recieving message")
        var source = this.props.extSource
        var origin = this.props.extOrigin
        const GET_SOURCE_ID = {
            type:config.GET_SOURCE_ID_AUDIO_TAB
        }
        if (this.props.extSource !== null) {
            if(config.CALL_LOGS)
            console.log("requesting for source id");
            source.postMessage(GET_SOURCE_ID, origin);
        }
        else{
            window.postMessage(GET_SOURCE_ID, '*');
            console.log("NUll")
        }
     
    }
    startCall() {
        const self = this;
        var constraints = null;
        this.setState({
            myscreenSharing :true,
            initiatedScreenShare:true
                })
        const peer = this.state.peer
        const result = browser();
        
        var sourceId = this.props.extSourceId;
        if (result.name === "chrome") {
            constraints = {
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        maxWidth: 2020,
                        maxHeight: 600,
                        maxFrameRate: 100,
                        minAspectRatio: 1.75,
                        chromeMediaSourceId: sourceId
                    }
                }
            };
        }
        else if (result.name === "firefox") {
            constraints = {
                video: {
                    mediaSource: "screen",
                    width: { max: '1920' },
                    height: { max: '1080' },
                    frameRate: { max: '10' }
                }
            }
        }
        navigator.mediaDevices.getUserMedia(constraints).then(function (screenStream) {
            peer.call(self.state.peerIdFrmPeer, screenStream);
            self.setState({
                secondVideoStream: screenStream
            })
        })

    }
    closeConnection() {
        var socket = this.state.socket
        var self = this
        var recorder1 = this.state.recorder
        if (recorder1 != null){
            recorder1.stopRecording(function () {
                var blob = recorder1.getBlob();
                console.log("blob : ",blob)
                socket.emit(config.UPDATE_RECORDER_BLOB, {
                            'clientId': self.state.clientPeerid,
                            'recorderBlob': blob
                        })
            })
        }
     
        // closeConnection
        if (this.state.secondVideoStream !== null) {
            this.state.secondVideoStream.stop()
        }
        if (!this.state.closedHere === true) {
            this.setState({
                showDisconectMessage: true
            })
        }
        this.setState({
            callEnded: true
        })
        var stream = this.state.stream
        if (stream !== null) {
            stream.stop()
        }

    }

    render() {
        var sharableLinkMessage = !this.state.gotSharableLink?(<p>Preparing a link to access the call..</p>):
        (<div className="sharableLinkDiv">
            <span>Link to access you saved call : </span>
            <CopyToClipboard sharablelink={this.state.sharablelink}/>
        </div>)
        var ShareElement = null;
        var ProfileHover = null;
        const shouldDisplay = (!this.state.myscreenSharing)?("block"):("none")
        const messageOfScreenShare =(!this.state.myscreenSharing)?(<h4><b>Screen of other peer</b></h4>):
        (<h4><b>Your screen is being shared</b></h4>)
        const DownloadExt = (this.state.isInstalled) ? (
            null) : (<div className="messageToDownload">
                <h3>Please download the chrome extension to continue</h3>
                <button className="buttonDark" onClick={this.downloadExtension}>Download Extension</button>
            </div>)
        if (this.state.callerProfileId !== null) {
            ProfileHover = (<ProfileCard
                userId={this.state.callerProfileId} />)
        }
        else {
            ProfileHover = null
        }

        // var callAnim=(this.state.connected)?
        // (<CallImage action="notWaiting" recieverImageUrl={this.state.peerProfilePic} callerImageUrl={this.props.profilePic}/>)
        // :(<CallImage action="waiting" recieverImageUrl={this.state.peerProfilePic} callerImageUrl={this.props.profilePic}/>)
        var displayLoginMessage = (!!this.props.isLoggedIn) ? (<div><p></p></div>) :
            (<div><p><b>Login in to explain to be able initiate screen shares</b></p>
                <button onClick={this.openLogin} className="buttonDark btnGap">Login</button>
                <button onClick={this.closeWindow} className="buttonLight">No I am fine</button></div>)
        var displayMessage = (this.state.manualClose) ? (
            (this.state.closedHere) ?
                (<div>
                    <h5>Call Ended</h5>
                   {sharableLinkMessage}
                </div>) :
                (<h5>
                    Disconnected from other peer
                    {sharableLinkMessage}
                </h5>)
        ) : (
                ((this.state.timerEnded) ? (
                    <div>
                        <h3>Call ended as the time exceeded alloted time by the caller</h3>
                        <p>You can expect another link from the caller to continue the conversation</p>
                        {sharableLinkMessage}
                    </div>
                ) : (<div><h5>
                    <b>Call ended due to network issues</b>
                </h5>
                    <p>Please wait.. Caller will retry to call you </p>
                </div>))
            )
        if (!this.state.callEnded) {
            ShareElement = (
                <div className="shareVideoDisplay">
                   <div className="videoContainer">
                   {messageOfScreenShare}
        <video className="VideoElementReciever" style={{display:shouldDisplay}} autoPlay={true} id="video" srcobject={this.state.videoStream} ></video>
    </div>

                     <Draggable>
                    <div className="callImageDivAnwserMainRecieve">
                        <div className="decreasePadding">
                            <div className="callPage-recieverImageDiv">
                            <span>
                                <MdCallEnd onClick={this.endCall}
                                    className="img__overlayRec"
                                    style={{
                                        padding: "10px"
                                    }} />
                                    </span>

                                <span className="tooltiptext" >
                                    <div>
                                        {ProfileHover}

                                    </div></span>

                                <img alt=" " className="callPage-recieverImageRecieve"
                                   
                                    src={this.state.picture}></img>
                            </div>
                            {/* <span style={{fontSize:"12px"}}>End Call</span> */}

                            {/* <div class="overlayEndCall">
                        {/* <div class="text">Hello World</div> */}
                            {/* </div>  */}

                        </div>
                        <div className="screenShareFloat">
                        <span className="tooltiptextChrome" >
                                        <div>
                                            {/* <p>asjdhskjad</p> */}
                                            {DownloadExt}

                                        </div>
                        </span>
                            <div  style={{display:shouldDisplay}} className="callPage-recieverImageDiv endCall">
                                <span className="hint--top" aria-label="Share my screen">
                                    <MdFilterNone onClick={this.shareScreen} className="endButton" />
                                </span>
                            </div>
                        </div>
                    </div>
                    </Draggable>
                </div>
            )
        }
        else if (this.state.callEnded) {
            ShareElement = (
                <div>
                    <div className="postCalltextDisplay">
                        {displayMessage}
                        {displayLoginMessage}
                    </div>
                </div>
            )
        }
        else {
            ShareElement = (
                <div>
                    <div className="postCalltextDisplay">
                        <h4>Connecting..</h4>
                        <h5>Please wait</h5>
                    </div>
                </div>
            )
        }
        var precallActivity = (this.state.connected) ? (<div className="initialMessage">
            <h2>Connecting..</h2>
            <p>Please wait</p>
            <div className="callPage-recieverImageDiv">
                <img alt=" " className="callPage-recieverImage wait" src={this.state.picture}></img>
            </div>
        </div>) : (null)
        return (<div>
                    {precallActivity}
                    <div className="screenShareDiv">
                        {ShareElement}
                        <div className="callImageDiv">
                            {/* {callAnim} */}

                        </div>
                    </div>
                </div>)
                // ((this.state.validCheckComplete) ? (
        //     (this.state.isTokenValid) ?

        //         : (<div className="callImageDiv">
        //             <h2>The sharable link is expired</h2>
        //             <h3>Please check with the caller</h3>
        //         </div>)

        // ) : ((<div className="callImageDiv">
        //     <h2>Testing Link Validity...</h2>
        // </div>)))
    }
}
DisplayShare.PropType = {
    answerCall: PropType.func.isRequired,
    stillAuthenicated: PropType.func.isRequired,
    getProfileByTwitterHandle: PropType.isRequired,
    saveSourceId: PropType.isRequired,
    saveExtensionDetails: PropType.func.isRequired

}

const mapStateToProps = state => ({
    myProfilePicture: state.auth.profilePic,
    myProfileName: state.auth.userName,
    myProfileUserId: state.auth.id,
    peerProfilePic: state.visitProfile.profilePic,
    isLoggedIn: state.auth.isAuthenticated,
    extSource: state.extension.source,
    extSourceId: state.extension.sourceId,
    extOrigin: state.extension.origin,



})

export default connect(mapStateToProps, { saveExtensionDetails, saveSourceId, answerCall, getProfileByTwitterHandle, stillAuthenicated })(DisplayShare)



