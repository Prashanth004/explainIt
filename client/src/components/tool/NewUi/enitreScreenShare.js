import React, { Component } from 'react'
import RecordRTC from 'recordrtc'
import { Button } from 'reactstrap'
import bigInt from "big-integer";
import { resetValues } from '../../../actions/twitterApiAction'
import Dummy from './dummy';
import DownloadExt from './container/DownloadExt'
import BusyAction from './container/BusyAction';
import {registerCallToBrowser,registerEndToBrowser} from './container/miscFunction';
import { explainByRecord } from '../../../actions/explainAction';
import PostSharing from './screenShare/postScreenSgare'
import { openCreated } from '../../../actions/navAction'
import { updateCurrentTime, setpeerId, answeredCall, updateRemainingTime, basicInfoCall, disableCallAction, callFailedUpdate, muteAudio, unMuteAudio } from '../../../actions/callAction'
import { setStream } from '../../../actions/streamActions'
import { saveSourceId } from "../../../actions/extensionAction";
import { startSecodScreenShare, endSecondScreenShare } from '../../../actions/secondShareAction'
import config from '../../../config/config';
import { fromShareToRecord } from '../../../actions/messageAction'
import '../../css/shareScreen.css';
import CallImage from './CallImage'
import browser from 'browser-detect';
import { postEndCall, displayScreenSharebutton, refreshExtension } from '../../../actions/extensionAction'
import Call from './Call';
import { FiX, FiVideo } from "react-icons/fi";

import {
    fullStartedSharing,
    fullStopedSharing,
    saveVideoBlob
} from '../../../actions/toolActions'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { restAllToolValue } from "../../../actions/toolActions";
import { cancelAllMessageAction } from '../../../actions/messageAction';
import { displayFullScrenRecord } from '../../../actions/toolActions';
import { durationInMinutes, callSuccessedUpate, initiateSend } from '../../../actions/callAction'
import { sendTweet } from '../../../actions/twitterApiAction';
import LinkDisplay from './TweetAcceptHandle'

class ScreenRecorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recorder: null,
            saveinitiated: false,
            peercalled: false,
            audioStream: null,
            canvasStream: null,
            downloadUrlVideo: null,
            blob: null,
            finalStream: null,
            CallAck: false,
            conn: null,
            destkey: null,
            socket: null,
            peer: null,
            ringAck: false,
            peerId: null,
            timerEnded: false,
            connected: false,
            shareScreenLink: null,
            sourceId: null,
            screenStream: null,
            call: null,
            closedHere: false,
            showDisconectMessage: false,
            timeOutNoAnswer: false,
            clickedOnLink: false,
            conDidNotInitiate: false,
            recieverProfilePic: null,
            recieverProfileName: null,
            manualClose: false,
            retryLimit: 0,
            retry: false,
            initiatedCloseCall: false,
            noInternet: false,
            doneTweeting: false,
            stopedSharing: false,
            tweetBtnPressed: false,
            recieverProfileId: null,
            isInstalled: true,
            maxTimeForVideo: null,
            secondShareStrem: null,
            answerFrmPeer: false,
            messageFrmPeer: null,
            timeOutNoAnswerOnCAll: false,
            videoStream: null,
            myscreenSharing: true,
            peerAudioBlob: null,
            problemInsavingCall: false,
            triedCallingUpdated: false,
            permissonDenied: false,
            onGoingCallEnded: false,
            downloadUrlAudio: null,
            retryTimeOut:false,
            currentAtionStatus:null,
            connectionFailed:false

        }
        this.renderer = this.renderer.bind(this);
        this.stopShare = this.stopShare.bind(this);
        this.startScreenShareSend = this.startScreenShareSend.bind(this);
        this.generateLink = this.generateLink.bind(this);
        this.savefilePrivate = this.savefilePrivate.bind(this);
        this.savefilePublic = this.savefilePublic.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.endCall = this.endCall.bind(this)
        this.retryCall = this.retryCall.bind(this);
        this.recordCall = this.recordCall.bind(this);
        this.changeTweetStatePos = this.changeTweetStatePos.bind(this);
        this.changeTweetStateNeg = this.changeTweetStateNeg.bind(this);
        this.closeButton = this.closeButton.bind(this);
        this.sendLink = this.sendLink.bind(this);
        this.peerCall = this.peerCall.bind(this);
        this.expireTimer = this.expireTimer.bind(this)
        this.downloadExtension = this.downloadExtension.bind(this);
        this.makeCallAction = this.makeCallAction.bind(this);
        this.recordCallAfterShare = this.recordCallAfterShare.bind(this);
        this.shareMyScreen = this.shareMyScreen.bind(this);
        this.concatinateBlob = this.concatinateBlob.bind(this);
        this.openSavedCall = this.openSavedCall.bind(this);
        this.triedCalling = this.triedCalling.bind(this);
        this.endWhileOngoinCall = this.endWhileOngoinCall.bind(this);
        this.muteAudio = this.muteAudio.bind(this);
        this.unMuteAudio = this.unMuteAudio.bind(this);
        this.saveBlobtimeOut = this.saveBlobtimeOut.bind(this);
        this.callEndBeforeRecieve = this.callEndBeforeRecieve.bind(this);
        this.play_clicked = this.play_clicked.bind(this);
        this.pause_clicked =  this.pause_clicked.bind(this);
        this.onUnload = this.onUnload.bind(this);
        this.postMessageHandler = this.postMessageHandler.bind(this);
        this.callConnectionDelayed = this.callConnectionDelayed.bind(this);
    }

    muteAudio() {
        const { audioStream } = this.state;
        if(audioStream !==null){
            var audioTracks = audioStream.getAudioTracks();
            if (audioTracks[0]) {
                audioTracks[0].enabled = false;
            }
            this.props.muteAudio()
        }
       
    }
    unMuteAudio() {
        const { audioStream } = this.state;
        if(audioStream !==null){
        var audioTracks = audioStream.getAudioTracks();
        if (audioTracks[0]) {
            audioTracks[0].enabled = true;
        }
        this.props.unMuteAudio()
        }
    }

    startScreenShareSend() {
        var self = this
        var constraints = null;
        var sourceId = this.props.extSourceId;
        const result = browser();
      
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
        if (config.CALL_LOGS)
            console.log("chorme media constraints : ", constraints)
        if (result.name === "firefox") {
            constraints = {
                video: {
                    mediaSource: "screen",
                    width: { max: '1920' },
                    height: { max: '1080' },
                    frameRate: { max: '10' }
                }
            }
        }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (audioStream) {
            navigator.mediaDevices.getUserMedia(constraints).then(function (screenStream) {
                if (config.CALL_LOGS)
                    console.log("got audio and video streams")
                var finalStream = new MediaStream();
                var videoTracks = screenStream.getVideoTracks();
                videoTracks.forEach(function (track) {
                    finalStream.addTrack(track);
                });

                var audioTracks = audioStream.getAudioTracks();
                audioTracks.forEach(function (track) {
                    finalStream.addTrack(track);
                });

                self.props.setStream(audioStream, screenStream, finalStream)
                self.setState({
                    audioStream: audioStream,
                    screenStream: screenStream,
                    finalStream: finalStream,
                    saveinitiated: false,
                    retry: false
                })
            }).catch(err => {
                console.log("error ouucres : ", err)
            })
        });
    }
    endCall() {
        registerEndToBrowser();
        const { extSource, extOrigin } = this.props
        postEndCall(config.END_CALL_PEER_FROM_EXTNESION, extSource, extOrigin)
        var self = this
        var peer = this.state.peer;
        var socket = this.state.socket
        this.setState({
            closedHere: true,
            manualClose: true
        })
        socket.emit(config.END_CALL, {
            'peerId': this.state.peerId,
            'timer-ended': false
        });
        if (peer !== null) {
            peer.destroy();
            this.setState({
                peerId: null,
                peer: null
            })
        }
        // self.stopShare()
        self.setState({
            initiatedCloseCall: true
        })
    }

    receiveMessage() {
        if (config.CALL_LOGS)
            console.log("starting to send request for source id")
        var source = this.props.extSource
        var origin = this.props.extOrigin
        const GET_SOURCE_ID = {
            type: config.GET_SOURCE_ID_AUDIO_TAB,
            data: {

            }
        }
        if (this.props.extSource !== null) {
            if (config.CALL_LOGS)
                console.log("requesting for source id");
            source.postMessage(GET_SOURCE_ID, origin);
        }
        else {
            window.postMessage(GET_SOURCE_ID, "*");
        }
    }
    expireTimer() {
        var peer = this.state.peer;
        var self = this;
        if (!this.state.clickedOnLink) {
            if (peer !== null) {
                peer.destroy()
            }
            self.setState({
                timeOutNoAnswer: true,
                peer: null
            })
        }
    }
    play_clicked() {
        var AudioPlyr = document.querySelector('#AudioPlyr')
        if(AudioPlyr)
        AudioPlyr.play();
    }
    pause_clicked(){
        var AudioPlyr = document.querySelector('#AudioPlyr')
        if(AudioPlyr)
        AudioPlyr.pause();
    }
    
    onUnload(event) { // the method that will be used for both add and remove event
        registerEndToBrowser();
     if(this.props.isSceenSharing){
        this.endCall()
        event.returnValue = "Hellooww"
     }
     else{
        //  event.preventDefault();
     }
      
    }
    postMessageHandler(event) {
        var self = this;
      
        if (event.data.sourceId !== undefined) {
            if (config.CALL_LOGS)
                console.log("recieved source id : ", event.data.sourceId)
            self.props.saveSourceId(event.data.sourceId)
            self.startScreenShareSend()
            return
        }
        if (event.data.type === config.PERMISSION_DENIED) {
            self.setState({ permissonDenied: true })
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
    }

    componentDidMount() {
        // const videoPlayer = this.VideoPlyr;
        // videoPlayer.addEventListener("playing", this.play_clicked, false);
        window.addEventListener("beforeunload", this.onUnload)
        var socket = this.props.socket;
        var self = this
        var peer = this.state.peer;

        if (window.addEventListener) {
            window.addEventListener("message", this.postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", this.postMessageHandler);
        }

        socket.on(config.CALL_ACK_MESSAGE, data => {

            var userId = Number(data.recieverUserId);
            userId = bigInt(data.recieverUserId).value;
            self.setState({
                recieverProfilePic: data.recieverProfilePic,
                recieverProfileName: data.recieverProfileName,
                recieverProfileId: userId
            })
            if (data.clientId === self.state.peerId) {
                self.setState({
                    CallAck: true,
                })
            }
        })
        socket.on(config.UPDATE_RECORDER_BLOB, data => {
            if (data.clientId === self.state.destkey) {
                if (!this.state.saveinitiated)
                    this.setState({
                        peerAudioBlob: data.recorderBlob
                    })
            }
        })

        socket.on(config.LINK_TO_CALL_ACK, data => {
            if (data.fromUserId === this.props.userId) {
                this.setState({
                    ringAck: true
                })
            }
        })
        socket.on(config.ENDING_RING_ACK, data => {
            if (data.ToUserId === this.props.userId) {
                self.setState({
                    timeOutNoAnswerOnCAll: true
                })
            }
        })
        socket.on(config.REJECT_REPLY, data => {
            if (data.toUserId === this.props.userId)
                self.setState({
                    answerFrmPeer: true,
                    messageFrmPeer: data.message
                })
        })
        socket.on(config.ACCEPT_SHARE_REQUEST, data => {
            if (data.toUserId === this.props.userId) {
                this.props.answeredCall();
                self.setState({clickedOnLink: true});
                self.callConnectionDelayed = setTimeout(()=>{
                    if(!this.state.permissonDenied && !this.props.isSceenSharing && !this.state.onGoingCallEnded){
                        this.setState({ connectionFailed : true});
                        console.log("connection failed")
                    }
                },25000);
            }
        })
        socket.on(config.CLOSE_NETWORK_ISSUE, data => {
            console.log(" close network issue : ");
            if (data.otherPeerId === self.state.destkey) {
                self.stopShare();
                const { extSource, extOrigin } = this.props
                postEndCall(config.END_CALL_PEER_FROM_EXTNESION, extSource, extOrigin)
                self.setState({
                    initiatedCloseCall: true
                })
            }
        })

        socket.on(config.END_CALL, data => {

            if (data.clientId === self.state.destkey) {
                console.log(" socket endCall : ");
                const { extSource, extOrigin } = this.props
                postEndCall(config.END_CALL_PEER_FROM_EXTNESION, extSource, extOrigin)
                if (peer !== null) {
                    peer.destroy();
                    this.setState({
                        peerId: null,
                        peer: null,
                        manualClose: true
                    })
                }
                if (!self.state.initiatedCloseCall) {

                    self.stopShare()
                    self.setState({
                        initiatedCloseCall: true
                    })
                }
                else {
                    self.stopShare()
                }
            }

        })

        socket.on(config.ENDCALL_ACK, data => {
            if (data.clientId === self.state.peerId) {
                this.stopShare()
            }
        })

        socket.on(config.CHECK_TOKEN_VALIDITY, data => {

            if (data.clientId === self.state.peerId) {
                socket.emit(config.COMFIRM_TOKEN_VALIDITY, {
                    success: 1,
                    msg: "token valid",
                    id: self.props.userId,
                    profilePic: self.props.profilePic,
                    twitterHandle: self.props.callerTwitterHandle,
                    profileName: self.props.userName
                })
            }
        })
    }
    componentWillUnmount() {
        registerEndToBrowser();
        window.removeEventListener("beforeunload", this.onUnload);
        // window.removeEventListener("message",this.postMessageHandler);
        // this.props.fullStopedSharing()
        clearTimeout(this.saveBlobtimeOut);
        clearTimeout(this.callEndBeforeRecieve);
        clearTimeout(this.callConnectionDelayed);
    }



    componentWillMount() {
        const { extSource, extOrigin } = this.props;
        this.props.refreshExtension(config.FULL_SCREEN_SHARE, extSource, extOrigin);
        const result = browser();
        const currentAtionStatus = JSON.parse(localStorage.getItem('currentAction'));
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
        var self = this;
        var peer = new window.Peer()
        this.setState({
            peer: peer,
            socket: this.props.socket,
            currentAtionStatus : currentAtionStatus
        });
     
        peer.on('open', (id) => {
            self.props.setpeerId(id)
            self.setState({
                peerId: id
            })
            self.generateLink()
        });
        peer.on('call', function (call) {
            call.answer()
            self.props.updateRemainingTime(self.props.currentTimeLeft)
            call.on('stream', function (stream) {
                self.setState({
                    videoStream: stream,
                    myscreenSharing: false
                })
                var audio = document.querySelector('#secondShareVideo');
                audio.srcObject = stream
                self.props.startSecodScreenShare(stream)
                const { extSource, extOrigin } = self.props
                self.props.displayScreenSharebutton(extSource, extOrigin)
                self.setState({
                    myscreenSharing: false
                })

            })
        })
        
        peer.on('connection', (conn) => {
            if (config.CALL_LOGS)
                console.log("got the connection set")
            this.setState({ conn: conn })
            conn.on('open', () => {
                console.log("connection opneed : ")
                this.setState({ clickedOnLink: true })
                const result = browser();
                if (config.CALL_LOGS)
                    console.log("requesting fot peerid on just made webRtc connection", conn)
                conn.send({
                    data: "sendID",
                    timer: this.props.timeAloted,
                    profilePic: this.props.twirecieverPrfilePic
                })
                conn.on('error',(err)=>{
                    console.log("conn errr : ----");
                    console.log("error : ",err)
                })
                conn.on('close',()=>{
                    console.log("closed conn")
                })
                conn.on('data', (data) => {
                    if (data.type === config.MESSSAGE_FOR_CONNECTION_WITH_ID) {
                        if (config.CALL_LOGS)
                            console.log("got the peerid over connection. noe get stream abd make call")
                            if (!this.state.onGoingCallEnded) {
                                self.setState({ destkey: data.clientId });

                                if (result.name === "chrome")
                                    self.receiveMessage()
                                else if (result.name === "firefox")
                                    self.startScreenShareSend()
                            }
                    }
                    if (data.type === config.PEER_SHARE_SCREEN_REQUEST) {
                        if (data.otherPeerId === self.state.destkey) {
                            self.props.updateRemainingTime(self.props.currentTimeLeft)
                            const { extSource, extOrigin } = self.props
                            self.props.displayScreenSharebutton(extSource, extOrigin);
                            self.setState({ myscreenSharing: false })
                        }
                    }
                });

            });
        });
        peer.on('error',function(error){
            console.log("perr error : -----")
            console.log("error : ",error);
            console.log("errorType : ",error.type)
        })

        peer.on('disconnected', function () {
            if (!self.state.initiatedCloseCall) {
                self.stopShare()
                self.setState({
                    initiatedCloseCall: true
                })

            }
        });
    }
    componentDidUpdate() {
        if (this.state.audioStream !== null &&
            this.state.screenStream !== null &&
            this.state.finalStream !== null &&
            this.state.destkey !== null &&
            !this.state.peercalled) {
            this.setState({
                peercalled: true
            })
            this.peerCall()
        }
    }
    shareMyScreen() {
        this.props.updateRemainingTime(this.props.currentTimeLeft)
        const { conn } = this.state
        const self = this
        this.setState({
            myscreenSharing: true
        })
        conn.send({
            'type': config.PEER_SHARE_SCREEN_REQUEST,
            'otherPeerId': self.state.peerId
        });
        // socket.emit(config.ACCEPT_SHARE_OTHRT_PEER_SCREEN, {
        //     'otherPeerId': self.state.peerId
        // })
    }
    saveBlobtimeOut = () => { }
    callEndBeforeRecieve = () => { };
    callConnectionDelayed = ()=>{};

    peerCall() {
        const { twitterUserId, fullStartedSharing } = this.props
        const self = this;
        const { socket, peer, destkey, finalStream } = this.state
        
        var call = peer.call(destkey, finalStream);
        if (config.CALL_LOGS)
        console.log("Made peer call with other peer is and streams")
        var recorder1 = RecordRTC(finalStream, {
            type: 'video'
        });
        recorder1.startRecording();
        registerCallToBrowser();
        this.setState({ recorder: recorder1 });
        self.saveBlobtimeOut = setTimeout(() => {
            const { recorder } = self.state;
            if (recorder !== null) {
                recorder.stopRecording(function () {
                    var blob = recorder.getBlob();
                    self.setState({
                        downloadUrlVideo: URL.createObjectURL(blob),
                        blob: blob,
                        recorder: null
                    });
                    saveVideoBlob(blob);
                });
            }
        }, config.VIDEO_RECORDING_SAVE_LIMIT * 1000);
        if (call) {
            call.on('stream', function (remoteStream) {
                fullStartedSharing(twitterUserId)
               
                var audio = document.querySelector('#video');
                audio.srcObject = remoteStream
                audio.play()
                self.setState({ connected: true })
            }, function (err) {
                console.log('Failed to get local stream', err);
            });
            call.on('close', function () {
                if (!self.state.initiatedCloseCall) {
                    self.stopShare()
                    self.setState({ initiatedCloseCall: true })
                }
                socket.emit(config.CLOSE_NETWORK_ISSUE, {
                    'otherPeerId': self.state.peerId
                })
            })
        }
}

    discard = () => {
        setTimeout(() => {
            window.close()
        }, 300);
    }

    renderer = ({ hours, minutes, seconds, completed }) => {
        localStorage.setItem("timer", (minutes + (seconds / 60)))
        var curTime = (minutes + (seconds / 60))
        if (curTime !== 3)
            this.props.updateCurrentTime(minutes + (seconds / 60))
        var socket = this.state.socket
        if (completed) {
            socket.emit(config.END_CALL, {
                'peerId': this.state.peerId,
                'timerEnded': true
            })
            if (!this.props.isSharingCompleted) {
                var peer = this.state.peer
                if (peer != null) {
                    peer.destroy()
                }
                this.setState({
                    timerEnded: true,
                })
            }
            return (<Dummy></Dummy>)
        } else {
            // Render a countdown
            return <span>{hours}:{minutes}:{seconds}</span>;
        }
    };

    closeButton() {
        this.props.reStoreDefault()
        this.setState({
            showDisconectMessage: false,
            timeOutNoAnswer: false,
            clickedOnLink: false,
            conDidNotInitiate: false,
            manualClose: false,
            retryLimit: 0,
            retry: false,
            initiatedCloseCall: false,
            noInternet: false,
            doneTweeting: false,
            doneCalling: false
        })
    }

    generateLink() {
        var peerId = this.state.peerId;
        var shareScreenLink = config.react_url + '/connect/' + peerId;
        this.setState({
            shareScreenLink: shareScreenLink
        })
    }
    retryCall() {
        var socket = this.state.socket;
        var self = this
        this.setState({
            retry: true,
            retryLimit: this.state.retryLimit + 1,
            initiatedCloseCall: false

        })
        socket.emit(config.RETRYCALL, {
            "peerId": self.state.peerId
        })
        setTimeout(() => {
            if (self.state.retry && !self.state.clickedOnLink) {
                self.setState({
                    retryTimeOut: true
                })
            }
        }, 13000)
        // if (!navigator.onLine) {
        //     self.setState({
        //         noInternet: true
        //     })
        // }

    }

    savefilePublic(textData) {
        this.props.savefile(this.state.blob, 1, textData)
        var peer = this.state.peer;
        if (peer !== null) {
            peer.destroy();
            this.setState({
                peer: null
            })
        }
    }

    savefilePrivate() {
        var videoBlob = this.state.blob;
        this.setState({ saveinitiated: true })
        if (this.state.peerAudioBlob === null)
            this.setState({ problemInsavingCall: true });
        else {
            var audioBlob = new Blob([this.state.peerAudioBlob], { type: 'audio/wav' })
            this.setState({ downloadUrlAudio: URL.createObjectURL(audioBlob) })
            this.props.savefile(videoBlob, audioBlob, 0, this.props.callTopic, config.SERVER_SHARING)
            var peer = this.state.peer;
            if (peer !== null) {
                peer.destroy();
                this.setState({ peer: null })
            }
        }
    }

    concatinateBlob(otherAudioArrayBuffer) {
        var blobArray = [];
        var self = this;
        var otherAudioBlob = new Blob([otherAudioArrayBuffer], { type: 'video/webm' })
        blobArray.push(this.state.blob);
        blobArray.push(otherAudioBlob);
        window.ConcatenateBlobs(blobArray, 'video/webm', function (resultingBlob) {
            self.props.savefile(resultingBlob, 0, self.props.callTopic)
        });
    }
    recordCallAfterShare() {
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.displayFullScrenRecord()
        this.props.fromShareToRecord()
    }

    triedCalling() {

        this.setState({ triedCallingUpdated: true })
        this.props.callFailedUpdate(this.props.touser, this.props.callTopic)
    }
    recordCall() {
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.displayFullScrenRecord();
        this.props.fromShareToRecord();
    }
    resetTweetActions() {
        this.setState()
    }
    changeTweetStatePos() {
        this.setState({
            doneTweeting: true
        })
    }
    makeCallAction() {
        var self = this;
        var peerId = this.state.peerId;
        var shareScreenLink = config.react_url + '/connect/' + peerId;
        this.setState({
            shareScreenLink: shareScreenLink,
        })
        this.props.basicInfoCall(this.props.twitterUserId)
        this.callEndBeforeRecieve = setTimeout(() => {
            if (!this.state.answerFrmPeer && !this.state.onGoingCallEnded && !this.props.isCallAnswered && !this.state.clickedOnLink && !this.state.triedCallingUpdated) {

                self.props.callFailedUpdate(self.props.touser, self.props.callTopic);
                self.props.disableCallAction()
                self.setState({
                    timeOutNoAnswerOnCAll: true,
                    onGoingCallEnded: true
                })
                socket.emit(config.ENDING_RING, {
                    'fromUserId': this.props.userId,
                    'ToUserId': this.props.twitterUserId
                })
            }
        }, 25000)
        var socket = this.state.socket;
        if ((!this.props.busyStatus && this.props.onlineStatus)) {
            socket.emit(config.LINK_TO_CALL, {
                'link': shareScreenLink,
                'fromEmail': this.props.email,
                'fromUserName': this.props.userName,
                'fromProfilePic': this.props.profilePic,
                'fromUserId': this.props.userId,
                'ToUserId': this.props.twitterUserId
            })
        }
        this.setState({
            doneCalling: true
        })
    }
    changeTweetStateNeg() {
        this.setState({
            doneTweeting: false
        })
        this.props.resetValues();

    }

    stopShare() {
        const { twitterUserId, endSecondScreenShare, saveVideoBlob,
            fullStopedSharing, isSceenSharing, extOrigin, disableCallAction,
            extSource, postEndCall } = this.props
        const { stopedSharing, recorder, call, closedHere, timerEnded } = this.state
        const self = this;
        registerEndToBrowser();
        postEndCall(config.END_CALL_PEER_FROM_EXTNESION, extSource, extOrigin)
        if (!stopedSharing) {
            this.setState({ stopedSharing: true })

            if (call != null)
                setTimeout(() => { call.close(); }, 400);

            if (!closedHere && !timerEnded)
                this.setState({ showDisconectMessage: true })

            if (isSceenSharing)
                fullStopedSharing(twitterUserId);
            disableCallAction()

            var audioStream = this.props.audioStream;
            var screenStream = this.props.screenStream;
            if (audioStream !== null)
                audioStream.stop();
            if (screenStream != null)
                screenStream.stop();
            var audioStreamLocal = this.state.audioStream;
            var screenStreamLocal = this.state.screenStream;
            if (audioStreamLocal !== null)
                audioStream.stop();
            if (screenStreamLocal != null)
                screenStream.stop();
            var audio = document.querySelector('#video');
            if (audio !== null) {
                audio.src = "";
            }

            if (recorder !== null)
                recorder.stopRecording(function () {
                    var blob = recorder.getBlob();
                    self.setState({
                        downloadUrlVideo: URL.createObjectURL(blob),
                        blob: blob,
                        recorder: null
                    })
                    saveVideoBlob(blob)
                });
            endSecondScreenShare()
            this.setState({
                isAudioRecDone: true,
                clickedOnLink: false,
                isRecording: "",
                audioStream: null,
                canvasStream: null,
                call: null,
                peercalled: false
            })
        }
    }
    endWhileOngoinCall() {
        const { socket } = this.state
        this.setState({ onGoingCallEnded: true })
        socket.emit(config.END_WHILE_DIALING, {

            'ToUserId': this.props.twitterUserId
        })
    }
    openSavedCall() {

        this.props.toggleInbox()
        this.props.openCreated()
    }
    sendLink() {
        const self = this;
        const { failedToSave,explainBy, twitterUserId, initiateSend, largeFileSize, linkToAccess, callTopic } = this.props

        initiateSend();
        var issueId = JSON.parse(localStorage.getItem("issueId"));
        const socket = this.state.socket;
        var sharableLinkSaved = null;
        if(explainBy===config.null){
            sharableLinkSaved = (failedToSave || largeFileSize) ? (null) : (linkToAccess);
        }
        else{
            sharableLinkSaved = (config.react_url+"/project/"+issueId);
        }
        const saveStatus = (failedToSave || largeFileSize) ? ("false") : ("true");
        socket.emit(config.SEND_SHARABLE_LINK, {
            'otherPeerId': self.props.peerId,
            'successMessage': saveStatus,
            'sharableLink': sharableLinkSaved
        })
        var duration = durationInMinutes(this.props.initialTime, this.props.noOfIncreaseInTime, this.props.currentTimeLeft);
        callSuccessedUpate(twitterUserId, callTopic, duration, sharableLinkSaved)
    }
    downloadExtension() {
        window.open(config.EXTENSION_URL, "_self")

    }

    render() {
        
            var shareTimeElements = null;
            var postShareElements = null;
           


        if (this.props.linkToAccess !== null && this.props.isSharingCompleted ) {
            if (!this.props.sendinitiated) {
                this.sendLink()
            }
        }
        else{
            if(this.props.linkToAccess === null && this.props.isSharingCompleted && !this.state.manualClose && !this.state.timerEnded) {
                if (!this.props.sendinitiated) {
                    this.sendLink()
                }
            }

        }
        const audioWarning = (this.props.isSceenSharing && this.props.currentTimeLeft < 0.166) ? (<audio style={{ display: "none" }} autoPlay loop src={require('../../audio/time_out.wav')}></audio>) : (null)
        const closeFunction = (this.props.isSceenSharing) ? this.props.reStoreDefault :
            this.props.closeImidiate
        var linkElement = null;
        const closeBtn = (this.props.isSceenSharing ||  this.props.explainBy !== config.null) ?
        (null):(((this.state.doneCalling || this.state.answerFrmPeer) && !this.state.stopedSharing) ? (null) : (
            <div className="topBtnsActivity"><Button close onClick={closeFunction} /></div>))
           if (this.props.isSceenSharing) {

            var recieverProfPic = (this.props.twirecieverPrfilePic === null) ?
                (this.state.recieverProfilePic) :
                (this.props.twirecieverPrfilePic)

            const recieveProfileName = (this.props.twitterName === null) ?
                (this.state.recieverProfileName) : (this.props.twitterName)

            const recieverProfileId = (this.props.twitterUserId !== null) ? (
                this.props.twitterUserId
            ) : (this.state.recieverProfileId)

            // const MuteButton = (this.props.isMuted) ? (
            //     <button className="buttonLight" onClick={this.unMuteAudio}>Unmute </button>

            // ) : (<button className="buttonDark" onClick={this.muteAudio}>Mute </button>
            //     )
            shareTimeElements = (
                <div>
                    {/* {MuteButton} */}
                    <Call
                        conn={this.state.conn}
                        shareMyScreen={this.shareMyScreen}
                        myscreenSharing={this.state.myscreenSharing}
                        videoStream={this.state.videoStream}
                        socket={this.state.socket}
                        peerId={this.state.peerId}
                        renderer={this.renderer}
                        endCall={this.endCall}
                        otherPersonPic={recieverProfPic}
                        otherPersonName={recieveProfileName}
                        otherPersonProfileId={recieverProfileId}
                        secondShareStrem={this.state.secondShareStrem}
                    />
                </div>
            )
        }
        else if (this.state.clickedOnLink && !this.props.isSceenSharing)
            if (!this.state.retryLimit === 0)
                shareTimeElements = (<div className="clickedMessage">
                    <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                    <p>Connecting.. </p>
                </div>)
            else if (this.state.clickedOnLink && !this.props.isSceenSharing && this.state.conDidNotInitiate)
                shareTimeElements = (<div className="clickedMessage">
                    <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                    <p><b>Failed To connect</b></p>
                    <p>This happened due to network issues</p>
                </div>)

        if (this.props.isSharingCompleted && this.state.blob !== null && !this.state.clickedOnLink) {
            postShareElements=(<PostSharing 
                retryCall={this.retryCall}
               
           peerAudioBlob={this.state.peerAudioBlob}
           saveinitiated={this.state.saveinitiated}
           downloadUrlVideo={this.state.downloadUrlVideo}
           downloadUrlAudio ={this.state.downloadUrlAudio}
           retry ={this.state.retry}
           retryTimeOut={this.state.retryTimeOut}
           manualClose={this.state.manualClose}
           retryLimit={this.state.retryLimit}
           timerEnded={this.state.timerEnded}
           noInternet={this.state.noInternet}
           blob={this.state.blob}
           play_clicked={this.play_clicked}
           pause_clicked ={this.pause_clicked}
           recordCall={this.recordCall}
           showDisconectMessage={this.state.showDisconectMessage}
           isSaved={this.props.isSaved}
           explainBy={this.props.explainBy}
           savefilePrivate={this.savefilePrivate}
           linkToAccess={this.props.linkToAccess}/>)
        }
        if (
            !this.props.isSceenSharing &&
            !this.props.isSharingCompleted &&
            !this.state.timeOutNoAnswer &&
            !this.state.answerFrmPeer &&
            !this.state.timeOutNoAnswerOnCAll) {


            if (!this.state.doneTweeting && !this.state.clickedOnLink && !this.state.doneCalling)
                linkElement = (
                    <div>
                        <LinkDisplay
                            makeCallAction={this.makeCallAction}
                            closeImidiate={this.props.closeImidiate}
                            recordCallAfterShare={this.recordCallAfterShare}
                            shareScreenLink={this.state.shareScreenLink}
                            changeTweetStatePos={this.changeTweetStatePos} />
                    </div>)
            else if (this.state.doneCalling && !this.state.clickedOnLink) {
                if (!this.props.onlineStatus) {
                    if (!this.state.triedCallingUpdated) this.triedCalling()
                    linkElement = (<div>
                        <br />
                        <br />
                        <span><b>{this.props.CalluserName}</b>is not ready accept screen share requests at the moment</span>
                        <br />
                        <span>You can record the screen and send</span>
                        <br />
                        <br />
                        <span className="hint--bottom" aria-label="Record call and send">
                        <FiVideo className="icons" onClick={(this.props.explainBy===config.null)?this.recordCallAfterShare:this.props.explainByRecord} />
                        </span>                <span className="hint--bottom" aria-label="Cancel">
                            <FiX className="icons" onClick={this.props.closeImidiate} />
                        </span>
                    </div>)
                }
                else if (this.props.busyStatus) {
                    if (!this.state.triedCallingUpdated) this.triedCalling()
                    linkElement = (<div>
                        <br />
                        <br />
                        <span><b>{this.props.CalluserName}</b> is currently involved in Sharing or Recording activity. Try again after some time.</span>
                        <br />
                        <span>You can record the screen and send</span>
                        <br />
                        <br />
                        <span className="hint--bottom" aria-label="Record call and send">
                            <FiVideo className="icons" onClick={(this.props.explainBy===config.null)?this.recordCallAfterShare:this.props.explainByRecord} />
                        </span>                <span className="hint--bottom" aria-label="Cancel">
                            <FiX className="icons" onClick={this.props.closeImidiate} />
                        </span>
                    </div>)
                }
                else {
                    linkElement = ((!this.state.onGoingCallEnded) ? (
                        <div>
                            <div className="waitMsg">
                                <p>Waiting for <b>{this.props.twitterName}</b> to accept the Screen Share request, if not we can drop a recorded message</p>
                            </div>
                            <div className="callerImageDiv">
                                <CallImage
                                    action="waiting" callerImageUrl={this.props.profilePic}
                                    recieverImageUrl={this.props.twirecieverPrfilePic} />
                            </div>
                            <button className="buttonLight" onClick={this.endWhileOngoinCall}>End send request</button>
                        </div>
                    ) : (<div>
                        <p><b>Share Request Ended.</b></p>
                        <button className="buttonLight" onClick={this.props.closeImidiate}>Close</button>
                    </div>
                        ))

                }

            }
            else if (this.state.clickedOnLink)
                linkElement = ((!this.state.permissonDenied) ? (
                    (!this.state.onGoingCallEnded) ? (
                        (!this.state.connectionFailed)?(
                        <div>
                            <audio autoPlay style={{ display: "none" }} src={require('../../audio/brute-force.mp3')}></audio>

                            <div className="waitMsg">
                                <p><b>{this.props.twitterName} has accepted the request</b></p>
                            </div>
                            <div className="callerImageDiv">
                                <CallImage
                                    action="waiting" callerImageUrl={this.props.profilePic}
                                    recieverImageUrl={this.props.twirecieverPrfilePic} />
                            </div>
                        </div>):(<div>
                            <div className="callerImageDiv">
                            <p><b>Connection Failed due to network issues</b></p>
                            <button className="buttonLight" onClick={this.props.closeImidiate}>Close</button>
                            </div>
                        </div>)
                    ) : (<div>
                        <p><b>Share Request Ended.</b></p>
                        <button className="buttonLight" onClick={this.props.closeImidiate}>Close</button>
                    </div>
                        )

                ) : (<div><p><b>The screen could not be done as the permission denied</b></p>
                    <button className="buttonLight" onClick={this.props.closeImidiate}>Close</button></div>))
        }

        else if (!this.props.isSceenSharing &&
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            !this.state.timeOutNoAnswer &&
            !this.state.answerFrmPeer &&
            this.state.timeOutNoAnswerOnCAll)
            linkElement = (<div className="clickedMessage">
                <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                <span><b>{this.props.twitterName}</b> is not available to accept request.</span>
                <span>You can record the screen and send</span>
                <br />
                <span className="hint--bottom" aria-label="Record call and send">
                <FiVideo className="icons" onClick={(this.props.explainBy===config.null)?this.recordCallAfterShare:this.props.explainByRecord} />
                </span>                <span className="hint--bottom" aria-label="Cancel">
                    <FiX className="icons" onClick={this.props.closeImidiate} />
                </span>

            </div>)
        else if (!this.props.isSceenSharing &&
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            !this.state.timeOutNoAnswer &&
            this.state.answerFrmPeer) {
            linkElement = (<div className="clickedMessage">
                <p><b>{this.props.twitterName} has responded with a message</b></p>
                <p>message : {this.state.messageFrmPeer}</p>
                <p>Do You wish to record the screen and send?</p>
                <span className="hint--bottom" aria-label="Record call and send">
                <FiVideo className="icons" onClick={(this.props.explainBy===config.null)?this.recordCallAfterShare:this.props.explainByRecord} />
                </span>
                <span className="hint--bottom" aria-label="Cancel">
                    <FiX className="icons" onClick={this.props.closeImidiate} />
                </span>
            </div>)
        }
        else if (!this.props.isSceenSharing &&
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            this.state.timeOutNoAnswer)
            linkElement = (<div className="clickedMessage">
                <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                <p><b>Link expired</b></p>
                <p>Client did not click to get connected</p>
                <p>You can record the call and send</p>
                <span className="hint--bottom" aria-label="Record call and send">
                <FiVideo className="icons" onClick={(this.props.explainBy===config.null)?this.recordCallAfterShare:this.props.explainByRecord} />
                </span>                <span className="hint--bottom" aria-label="Cancel">
                    <FiX className="icons" onClick={this.props.closeImidiate} />
                </span>

            </div>)

        return (this.state.isInstalled) ? (


            (this.state.currentAtionStatus === null)?


            (<div>
              
                {audioWarning}
                <div className="LinkDisplay">
                {closeBtn}
                    {linkElement}
                    {shareTimeElements}
                    {postShareElements}
                    <audio id="video" ref={a => this.videoTag = a} srcobject=" " ></audio>
                </div>
            </div>):
            (<div className="LinkDisplay">
                {closeBtn}
                <BusyAction  currentAtionStatus = {this.state.currentAtionStatus}/>
                </div>)) : (<div ><DownloadExt /></div>)
    }
}
ScreenRecorder.PropType = {
    StartedSharing: PropType.func.isRequired,
    saveVideoBlob: PropType.func.isRequired,
    setStream: PropType.func.isRequired,
    saveSourceId: PropType.func.isRequired,
    restAllToolValue: PropType.func.isRequired,
    cancelAllMessageAction: PropType.func.isRequired,
    displayFullScrenRecord: PropType.func.isRequired,
    sendTweet: PropType.func.isRequired,
    resetValues: PropType.func.isRequired,
    endSecondScreenShare: PropType.func.isRequired,
    fromShareToRecord: PropType.func.isRequired,
    callFailedUpdate: PropType.func.isRequired,
    basicInfoCall: PropType.func.isRequired,
    initiateSend: PropType.func.isRequired,

}
const mapStateToProps = state => ({
    CalluserName: state.visitProfile.userName,
    peerId: state.call.peerId,
    isMuted: state.call.isMuted,
    timeAloted: state.call.noOfMinutes,
    isSharingCompleted: state.tools.isFullSharingCompleted,
    failedToSave: state.issues.failedToSave,
    largeFileSize: state.issues.largeFileSize,
    isSceenSharing: state.tools.isFullScreenSharing,
    isSaved: state.issues.successCreation,
    initialTime: state.call.initialTime,
    currentTimeLeft: state.call.currentTimeLeft,
    noOfIncreaseInTime: state.call.noOfIncreaseInTime,
    sharablelink: state.issues.sharablelink,
    issueId: state.issues.currentIssueId,
    extSource: state.extension.source,
    extOrigin: state.extension.origin,
    extSourceId: state.extension.sourceId,
    audioStream: state.stream.audioStream,
    screenStream: state.stream.screenStream,
    finalStream: state.stream.finalStream,
    profilePic: state.auth.profilePic,
    email: state.auth.email,
    isCallAnswered: state.call.isCallAnswered,
    userName: state.auth.userName,
    twirecieverPrfilePic: state.twitterApi.twitterProfilePic,
    twitterName: state.twitterApi.name,
    twitterUserId: state.twitterApi.twitterId,
    callerTwitterHandle: state.auth.twitterHandle,
    userId: state.auth.id,
    callTopic: state.call.topicOfTheCall,
    touser: state.call.touser,
    sendinitiated: state.call.sendinitiated,
    otherPeerRecorder: state.recorder.otherPeerRecorder,
    onlineStatus: state.visitProfile.onlineStatus,
    busyStatus: state.visitProfile.busyStatus,
    linkToAccess: state.projects.linkToAccess,
    explainBy: state.explain.explainBy

})

export default connect(mapStateToProps, {
    resetValues,
    refreshExtension,
    explainByRecord,
    postEndCall,
    muteAudio, unMuteAudio,
    disableCallAction,
    displayFullScrenRecord,
    displayScreenSharebutton,
    sendTweet,
    callSuccessedUpate,
    cancelAllMessageAction,
    restAllToolValue,
    startSecodScreenShare,
    saveSourceId,
    fullStartedSharing,
    setStream,
    initiateSend,
    fullStopedSharing,
    saveVideoBlob,
    setpeerId,
    openCreated,
    answeredCall,
    basicInfoCall,
    updateCurrentTime,
   
    endSecondScreenShare,
    fromShareToRecord,
    callFailedUpdate,
    updateRemainingTime
})(ScreenRecorder)
