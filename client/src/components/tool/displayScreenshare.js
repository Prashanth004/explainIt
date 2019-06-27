import React, { Component } from 'react'
import config from '../../config/config'
import RecordRTC from 'recordrtc'
import '../css/screenRecorder.css'
import '../css/shareScreen.css';
import '../css/call.css';
import Countdown from 'react-countdown-now';
import browser from 'browser-detect';
import CopyToClipboard from './CopytoClipboard'
import { saveExtensionDetails, saveSourceId } from "../../actions/extensionAction";
import { answerCall, muteAudio, unMuteAudio } from '../../actions/callAction'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import socketIOClient from "socket.io-client";
import { postStartCall, addExtraTimerfromReciever, decreaseTimerfromReciever,postEndCall, displayScreenSharebutton, refreshExtension } from '../../actions/extensionAction'
import { stillAuthenicated } from '../../actions/signinAction';
import { getProfileByTwitterHandle } from "../../actions/visitProfileAction";
import {setTime} from '../../actions/floaterAction';




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
            callerProfileName: null,
            sharablelink: null,
            gotSharableLink: false,
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
            initiatedScreenShare: false,
            myscreenSharing: false,
            failedToSaveMessage: false,
            selfClose: false,
            selfCloseTime: 1,
            connectionFailed: false,
            timeAloted: 3,
            blob : null
        }
        this.closeConnection = this.closeConnection.bind(this);
        this.endCall = this.endCall.bind(this);
        this.shareScreen = this.shareScreen.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.startCall = this.startCall.bind(this);
        this.downloadExtension = this.downloadExtension.bind(this);
        this.renderer2 = this.renderer2.bind(this);
        this.muteAudio = this.muteAudio.bind(this);
        this.unMuteAudio = this.unMuteAudio.bind(this);
        this.saveBlobtimeOut = this.saveBlobtimeOut.bind(this);
        this.onUnload = this.onUnload.bind(this);
    }
    downloadExtension() {
        window.open(config.EXTENSION_URL)

    }
    closeWindow() {
        window.close();
    }

    
    muteAudio(){
        var presentTime = JSON.parse(localStorage.getItem("timer"));
        this.props.setTime(presentTime)
        this.props.muteAudio()
        const {stream} = this.state;
        if(stream !==null){
        var audioTracks = stream.getAudioTracks();
        if (audioTracks[0]) {
                audioTracks[0].enabled = false; }
        }
    }
    unMuteAudio(){
        var presentTime = JSON.parse(localStorage.getItem("timer"));
        this.props.setTime(presentTime)
        const {stream} = this.state;
        if(stream !==null){
        var audioTracks = stream.getAudioTracks();
        if (audioTracks[0]) {
                audioTracks[0].enabled = true;}
            this.props.unMuteAudio();
        }
    }

    onUnload(event) { 
        if(!this.state.callEnded){
            const { extSource, extOrigin,postEndCall } = this.props;
            postEndCall(config.END_SCREED_RECORD_FROM_WEB, extSource, extOrigin);
            this.closeConnection();
            event.returnValue = " "
        }
       }
    componentDidMount() {
        var self = this;
        const {extSource, extOrigin} = this.props;
        window.addEventListener("beforeunload", this.onUnload);
        this.props.refreshExtension(config.RECIEVER_SCREEN_SHARE,extSource,extOrigin)
        const result = browser();
        if (config.ENVIRONMENT !== "test") {
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
        socket.emit(config.CHECK_TOKEN_VALIDITY, {
            'clientId': this.state.peerIdFrmPeer
        })
        var peerIdFrmPeer = this.state.peerIdFrmPeer;
        function postMessageHandler(event) {

            if (event.data === 'rtcmulticonnection-extension-loaded') {
                self.setState({
                    source: event.source,
                    origin: event.origin,
                    gotmessage: true
                })
                self.props.saveExtensionDetails(event.source, event.origin)
                return
            }
            if (event.data.type === config.END_CALL_RECIEVER_TO_WEB) {
                self.endCall()
                return
            }
            if(event.data.type === config.MUTE_TO_WEB){
                self.muteAudio()
                return
            }
            if(event.data.type === config.UNMUTE_TO_WEB){
                self.unMuteAudio()
                return
            }
            if (event.data.type === config.SHARE_MYSCREEN_FROM_EXTENSION) {
                self.shareScreen();
                return
            }
            if (event.data.sourceId !== undefined) {
                self.props.saveSourceId(event.data.sourceId)
                self.startCall()
                return
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
        })
        socket.on('error', function (err) {
        });
        socket.on('connect_timeout', function (err) {
        });
        socket.on("disconnect",()=>{
        })
        socket.io.on("connect_error",()=>{
        })
        
        socket.on(config.SEND_SHARABLE_LINK, data => {
            if (data.otherPeerId === self.state.peerIdFrmPeer) {
                if (data.successMessage === "true"){
                    if(data.sharableLink!==null)
                    localStorage.setItem('newIssueId',(data.sharableLink).split('/')[4]);
                    self.setState({
                        sharablelink: data.sharableLink,
                        gotSharableLink: true
                    })
                }
                else {
                    self.setState({
                        failedToSaveMessage: true
                    })
                }
            }
        })

          socket.on(config.CLOSE_NETWORK_ISSUE, data => {
            if (data.otherPeerId === self.state.peerIdFrmPeer) {
                self.closeConnection()
            }
        })

        socket.on(config.RETRYCALL, data => {

            if (data.peerId === self.state.peerIdFrmPeer) {
                self.peerConnections(socket, data.peerId)
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
                    callerProfileId: data.id,
                    callerProfileName: data.profileName
                })
            }
        })
        socket.on(config.END_CALL, data => {
            localStorage.setItem('infoDisplay', JSON.stringify(config.SCREEN_SHARE_ENDED_INFO))

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
  
        componentWillUnmount() {
            clearTimeout(this.saveBlobtimeOut);
        }
    

    componentWillMount() {
        localStorage.setItem('action', JSON.stringify(config.RECIEVER_SCREEN_SHARE))
        localStorage.setItem('muteState',JSON.stringify(config.UN_MUTED))
        var self = this
        setTimeout(() => {
            if (self.state.connected) {
                self.setState({ connectionFailed: true })
            }
            else {
            }
        }, 30000);
        const socket = socketIOClient(config.base_dir);
        this.setState({
            socket: socket,
            selfCloseTime: config.SELF_CLOSE_TIME
        })
        var peerIdFrmPeer = this.props.match.params.callerid;
        this.setState({ peerIdFrmPeer: peerIdFrmPeer })
        this.peerConnections(socket, peerIdFrmPeer);
        this.props.stillAuthenicated();
    }

    saveBlobtimeOut = ()=>{}

    peerConnections(socket, peerIdFrmPeer) {
        this.setState({
            socket: socket
        });
        this.props.answerCall()
     
            var peer = new window.Peer({
                host: window.location.hostname,
                port:  (window.location.protocol === 'https:' ? 443 : 80),
                path: '/peerjs',
                debug:2
            })

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
            
        var conn = peer.connect(peerIdFrmPeer);
        this.setState({conn : conn})
        conn.on('open', function () {
            conn.on('data', data => {
                var presentTime = null
                if(data.type === config.PEER_SHARE_SCREEN_REQUEST){
                    if (data.otherPeerId === self.state.peerIdFrmPeer) {
                        presentTime = JSON.parse(localStorage.getItem("timer"));
                        self.props.setTime(presentTime);
                        const { extSource, extOrigin } = self.props
                        self.props.displayScreenSharebutton(extSource, extOrigin)
                        self.setState({myscreenSharing: false })
                    }
                }
                if (data.data === "addtimer") {
                    presentTime = JSON.parse(data.timeAloted);
                    self.props.setTime(presentTime)
                    setTimeout(()=>{
                        self.props.addExtraTimerfromReciever(self.props.extSource, self.props.extOrigin);

                    },500)
                }
                if (data.data === "reduceTimer") {
                    presentTime = JSON.parse(data.timeAloted);
                    self.props.setTime(presentTime)
                    setTimeout(()=>{
                        self.props.decreaseTimerfromReciever(self.props.extSource, self.props.extOrigin);

                    },500)
                }
            })


            conn.on('data', data => {
                if (data.data === "sendID") {
                    if (config.CALL_LOGS) {
                     
                    }

                    conn.send({
                        type:config.MESSSAGE_FOR_CONNECTION_WITH_ID,
                        clientId: self.state.clientPeerid,
                    });
                    localStorage.setItem('profilePic', JSON.stringify(data.profilePic));
                    self.props.setTime(data.timer)
                  
                }
            })


        });
        const { postStartCall } = self.props
        peer.on('call', function (call) {

            navigator.mediaDevices.getUserMedia({ audio: true }).then(function (audiostream) {
                call.answer(audiostream)
                var recorder1 = RecordRTC(audiostream, {
                    type: 'audio'
                });
                recorder1.startRecording();
                self.setState({ recorder: recorder1 });
                self.saveBlobtimeOut = setTimeout(()=>{
                    const { recorder } = self.state;
                    if(recorder!== null){
                        recorder.stopRecording(function () {
                            var blob = recorder.getBlob();
                            self.setState({
                                downloadUrlVideo: URL.createObjectURL(blob),
                                blob: blob,
                                recorder:null
                            })
                           
                        });
                    }
                },config.VIDEO_RECORDING_SAVE_LIMIT * 1000)
                postStartCall(config.RECIEVER_SCREEN_SHARE,
                    self.props.extOrigin,
                    self.state.picture,
                    self.props.extSource,
                    self.props.floaterTime,
                    null
                )
               

                if (config.CALL_LOGS)
                call.on('stream', function (stream) {
                    socket.emit(config.CALL_ACK_MESSAGE, {
                        'clientId': self.state.clientPeerid,
                        'recieverProfilePic': self.props.myProfilePicture,
                        'recieverProfileName': self.props.myProfileName,
                        'recieverUserId': self.props.myProfileUserId
                    })
                    self.setState({
                        connected: false,
                        videoStream: stream
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
            socket.emit(config.ENDCALL_ACK, {
                'clientId': self.state.clientPeerid,
                'encCallAck': true
            })
            setTimeout(() => {
                if (!self.state.callEnded) {
                    self.closeConnection()
                }
            }, 4000)

        })
        peer.on('disconnected', function () {
            setTimeout(() => {
                if (!self.state.callEnded) {
                    self.closeConnection()
                }
            }, 4000)
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
        const { conn } = this.state;
        var self = this;
        var presentTime = JSON.parse(localStorage.getItem("timer"));
        this.props.setTime(presentTime)
        if (this.state.initiatedScreenShare) {
            conn.send({
                'type' : config.PEER_SHARE_SCREEN_REQUEST,
                'otherPeerId': self.state.clientPeerid
            })
            this.setState({
                myscreenSharing: true
            })
          
        }
        else {
            const result = browser();
            if (result.name === "chrome") {
                if (config.ENVIRONMENT !== "test") {
                    if (this.state.isInstalled) {
                        self.receiveMessage()
                    }
                }
                else {
                    self.receiveMessage()
                }
            }
            else if (result.name === "firefox") {
                self.startCall()
            }
        }
    }

    renderer2 = ({ hours, minutes, seconds, completed }) => {
        localStorage.setItem("timer", (minutes + (seconds / 60)))
        if (completed) {
            return (null)
        } else {
            return <span>{hours}:{minutes}:{seconds}</span>;
        }
    };


    receiveMessage() {
        var source = this.props.extSource
        var origin = this.props.extOrigin
        const GET_SOURCE_ID = {
            type: config.GET_SOURCE_ID_AUDIO_TAB
        }
        if (this.props.extSource !== null) {
            if (config.CALL_LOGS)
            source.postMessage(GET_SOURCE_ID, origin);
        }
        else {
            window.postMessage(GET_SOURCE_ID, '*');
        }

    }
    startCall() {
        const self = this;
        var constraints = null;
        this.setState({
            myscreenSharing: true,
            initiatedScreenShare: true
        });
        const { peer } = this.state;
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
            self.setState({ secondVideoStream: screenStream });
        });
    }
    closeConnection() {
        const self = this;
        const { socket, recorder, clientPeerid, closedHere, stream, secondVideoStream } = this.state;
        const { extSource, extOrigin, postEndCall } = this.props;
        const action = config.END_CALL_RECIEVER_PEER_FROM_WEB
        postEndCall(action, extSource, extOrigin)
        if (recorder != null) {
            recorder.stopRecording(function () {
                var blob = recorder.getBlob();
                socket.emit(config.UPDATE_RECORDER_BLOB, {
                    'clientId': clientPeerid,
                    'recorderBlob': blob,
                });
                self.setState({recorder : null, blob:blob})
            });

        }else{
            socket.emit(config.UPDATE_RECORDER_BLOB, {
                'clientId': clientPeerid,
                'recorderBlob': self.state.blob,
            });
        }

        if (secondVideoStream !== null)
            secondVideoStream.stop();
        if (!closedHere === true)
            this.setState({ showDisconectMessage: true });
        this.setState({
            callEnded: true,
            selfClose: true
        })
        if (stream !== null) stream.stop();
    }

    render() {

        var selfCloseTimer = (this.state.selfClose) ? (<div>

          
        </div>) : (null)
        var sharableLinkMessage = (!this.state.gotSharableLink && !this.state.failedToSaveMessage) ? (<p>Preparing a link to access the call..</p>) :
            ((!this.state.failedToSaveMessage && (this.state.sharablelink!==null|| this.state.sharablelink!==undefined))?
                (<div className="sharableLinkDiv">
                    <span>Link to access you saved call : </span>
                    <CopyToClipboard sharablelink={this.state.sharablelink} />
                </div>) : (<div>
                    <span>Problen occured while saving. This incident will be reported and fixed as soo as possible.</span>
                </div>))
        var ShareElement = null;
        // var ProfileHover = null;
        const shouldDisplay = (!this.state.myscreenSharing) ? ("block") : ("none")
        const messageOfScreenShare = (!this.state.myscreenSharing) ? (null) :
            (<h4><b>Your screen is being shared</b></h4>)
        // const DownloadExt = (this.state.isInstalled) ? (
        //     null) : (<div className="messageToDownload">
        //         <h3>Please download the chrome extension to continue</h3>
        //         <button className="buttonDark" onClick={this.downloadExtension}>Download Extension</button>
        //     </div>)
        // if (this.state.callerProfileId !== null) {
        //     ProfileHover = (<ProfileCard
        //         userId={this.state.callerProfileId} />)
        // }
        // else {
        //     ProfileHover = null
        // }

        var displayLoginMessage = (!!this.props.isLoggedIn) ? (<div><p></p></div>) :
            (<div><p><b>Login in to explain to be able initiate screen shares</b></p>
                <button onClick={this.openLogin} className="buttonDark btnGap">Login</button>
                <button onClick={this.closeWindow} className="buttonLight">No I am fine</button></div>)
        var displayMessage = (this.state.manualClose) ? (
            (this.state.closedHere) ?
                (<div>
                    <h5>Call Ended</h5>
                    {sharableLinkMessage}
                    {selfCloseTimer}
                </div>) :
                (<h5>
                    Disconnected from other peer
                    {sharableLinkMessage}
                    {selfCloseTimer}
                </h5>)
        ) : (
                ((this.state.timerEnded) ? (
                    <div>
                        <h3>Call ended as the time exceeded alloted time by the caller</h3>
                        {sharableLinkMessage}
                        {selfCloseTimer}
                    </div>
                ) : (!this.state.gotSharableLink ? (<div><h5>
                    <b>Call ended due to network issues</b>
                </h5>
                    <p>Please wait.. Caller will retry to call you </p>
                </div>) : (
                        <div><h5>
                            <b>Disconnected .</b></h5>
                            {sharableLinkMessage}
                            {selfCloseTimer}
                        </div>))))
       
        if (!this.state.callEnded) {
            ShareElement = (
                <div className="shareVideoDisplay">
                    <div className="videoContainer">
                        {messageOfScreenShare}
                        <div className="timerDiv">
                            <Countdown
                                date={Date.now() + this.props.floaterTime * 60 * 1000}
                                renderer={this.renderer2}
                            />

                        </div>
                        <video className="VideoElementReciever" style={{ display: shouldDisplay }} autoPlay={true} id="video" srcobject={this.state.videoStream} ></video>
                    </div>


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
        var precallActivity = (this.state.connected && !this.state.connectionFailed) ? (<div className="initialMessage">
            <h2>Connecting..</h2>
            <p>Please wait</p>
            <div className="callPage-recieverImageDiv">
                <img alt=" " className="callPage-recieverImage wait" src={this.state.picture}></img>
            </div>
        </div>) : ((this.state.connectionFailed) ? (
            <div className="postCalltextDisplay">
                <div>
                    <h5>
                        Connection failed due to network issues.
                    {selfCloseTimer}
                    </h5>
                </div>
            </div>
        ) : (null))
        return (<div>
            {precallActivity}
            <div className="screenShareDiv">
                {ShareElement}
                <div className="callImageDiv">

                </div>
            </div>
        </div>)

    }
}
DisplayShare.PropType = {
    answerCall: PropType.func.isRequired,
    stillAuthenicated: PropType.func.isRequired,
    getProfileByTwitterHandle: PropType.isRequired,
    saveSourceId: PropType.isRequired,
    saveExtensionDetails: PropType.func.isRequired,
    postStartCall: PropType.func.isRequired,
    setTime:PropType.func.isRequired,
    

    
}

const mapStateToProps = state => ({
    myProfilePicture: state.auth.profilePic,
    myProfileName: state.auth.userName,
    myProfileUserId: state.auth.id,
    peerProfilePic: state.visitProfile.profilePic,
    isLoggedIn: state.auth.isAuthenticated,
    extSource: state.extension.source,
    isMuted:state.call.isMuted,
    extSourceId: state.extension.sourceId,
    extOrigin: state.extension.origin,
    floaterTime:state.floater.floaterTime
})

export default connect(mapStateToProps, { postEndCall,setTime,decreaseTimerfromReciever,muteAudio, unMuteAudio, displayScreenSharebutton, addExtraTimerfromReciever, refreshExtension, postStartCall, saveExtensionDetails, saveSourceId, answerCall, getProfileByTwitterHandle, stillAuthenicated })(DisplayShare)



