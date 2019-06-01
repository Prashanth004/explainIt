import React, { Component } from 'react'
import RecordRTC from 'recordrtc'
import { Button } from 'reactstrap'
import bigInt from "big-integer";
import { resetValues } from '../../../actions/twitterApiAction'
import Dummy from './dummy';
// import ConcatenateBlobs  from 'concatenateblobs';
import { updateCurrentTime,setpeerId,updateRemainingTime,basicInfoCall,callFailedUpdate } from '../../../actions/callAction'
import { stillAuthenicated } from '../../../actions/signinAction';
import { setStream } from '../../../actions/streamActions'
import { saveSourceId } from "../../../actions/extensionAction";
import { startSecodScreenShare, endSecondScreenShare } from '../../../actions/secondShareAction'
import config from '../../../config/config';
import { fromShareToRecord } from '../../../actions/messageAction'
import '../../css/shareScreen.css';
import CallImage from './CallImage'
import browser from 'browser-detect';
import Call from './Call';
import { FiX, FiVideo } from "react-icons/fi";
import { MdReplay } from "react-icons/md";
// import {saveRecorder} from '../../../actions/recoderAction'
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
import {durationInMinutes,callSuccessedUpate,initiateSend} from '../../../actions/callAction'
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
            downloadUrl: null,
            isShareDone: false,
            blob: null,
            finalStream: null,
            host: config.peerHost,
            port: config.peerPort,
            path: config.peerPath,
            CallAck: false,
            conn: null,
            destkey: null,
            streamvideo: null,
            socket: null,
            peer: null,
            ringAck: false,
            peerId: null,
            timerEnded: false,
            connected: false,
            shareScreenLink: null,
            copyStatus: "copy link",
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
            isSaveClicked: false,
            recieverProfileId: null,
            isInstalled: true,
            maxTimeForVideo: null,
            secondShareStrem: null,
            answerFrmPeer: false,
            messageFrmPeer: null,
            timeOutNoAnswerOnCAll: false,
            videoStream: null,
            myscreenSharing: true
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
        this.tweetToParicipant = this.tweetToParicipant.bind(this);
        this.peerCall = this.peerCall.bind(this);
        this.saveClicked = this.saveClicked.bind(this);
        this.expireTimer = this.expireTimer.bind(this)
        this.downloadExtension = this.downloadExtension.bind(this);
        this.makeCallAction = this.makeCallAction.bind(this);
        this.recordCallAfterShare = this.recordCallAfterShare.bind(this);
        this.shareMyScreen = this.shareMyScreen.bind(this);
        this.concatinateBlob = this.concatinateBlob.bind(this);

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
        if(config.CALL_LOGS)
        console.log("chorme media constraints : ",constraints)
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
        navigator.mediaDevices.getUserMedia({ audio: true}).then(function (audioStream) {
            navigator.mediaDevices.getUserMedia(constraints).then(function (screenStream) {
                if(config.CALL_LOGS)
                console.log("got audio and video streams")
                var finalStream = new MediaStream();
                var videoTracks = screenStream.getVideoTracks();
                    videoTracks.forEach(function(track) {
                        finalStream.addTrack(track);
                    });

                var audioTracks = audioStream.getAudioTracks();
                    audioTracks.forEach(function(track) {
                        finalStream.addTrack(track);
                    });
                // Window.getTracks(audioStream, 'audio').forEach(function (track) {
                //     finalStream.addTrack(track);
                // });
                // Window.getTracks(screenStream, 'video').forEach(function (track) {
                //     finalStream.addTrack(track);
                // });
                self.props.setStream(audioStream, screenStream, finalStream)
                self.setState({
                    audioStream: audioStream,
                    screenStream: screenStream,
                    finalStream: finalStream,
                    retry: false
                })
            }).catch(err => {
                console.log("error ouucres : ", err)
            })
        });
    }
    endCall() {
        var source = this.props.extSource
        var origin = this.props.extOrigin
        const callStart = {
            type:config.END_CALL_PEER_FROM_EXTNESION,
            data:{timer:this.props.timeAloted,
            profilePic:this.props.otherPersonPic}
        }
        if (this.props.extSource !== null) {
            source.postMessage(callStart, origin);
        }
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
        })
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
        if(config.CALL_LOGS)
        console.log("starting to send request for source id")
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
            window.postMessage(GET_SOURCE_ID, "*");
            console.log("NUll")
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

    componentDidMount() {
        var socket = this.props.socket;
        var self = this
        var peer = this.state.peer;
        function postMessageHandler(event) {
            // console.log(event)
            if (event.data.sourceId !== undefined) {
                if(config.CALL_LOGS)
                console.log("recieved source id : ",event.data.sourceId)
                self.props.saveSourceId(event.data.sourceId)
                self.startScreenShareSend()
            }
        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
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
        socket.on(config.UPDATE_RECORDER_BLOB, data=>{
            console.log("data : ",data)
            if (data.clientId === self.state.destkey) {
                console.log("getting excecuted : ",data)
                this.savefilePrivate(data.recorderBlob)
            }
        })
       
        socket.on(config.ACCEPT_SHARE_OTHRT_PEER_SCREEN, data => {
            if (data.otherPeerId === self.state.destkey) {
                this.props.updateRemainingTime(this.props.currentTimeLeft)
                    self.setState({
                        myscreenSharing: false
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
        socket.on(config.ACCEPT_SHARE_REQUEST,data=>{
            if (data.toUserId === this.props.userId){
                self.setState({
                        clickedOnLink: true
                })
            }
        })
        socket.on(config.CLOSE_NETWORK_ISSUE, data => {
            if (data.otherPeerId === self.state.destkey) {
                self.stopShare();
                var source = this.props.extSource
                var origin = this.props.extOrigin
                const callStart = {
                    type:config.END_CALL_PEER_FROM_EXTNESION,
                    data:{timer:this.props.timeAloted,
                    profilePic:this.props.otherPersonPic}
                }
                if (this.props.extSource !== null) {
                    source.postMessage(callStart, origin);
                }
                self.setState({
                    initiatedCloseCall: true
                })
            }
        })

        socket.on(config.END_CALL, data => {
           console.log("data : ",data)

            if (data.clientId === self.state.destkey) {
                  var source = this.props.extSource
        var origin = this.props.extOrigin
        const callStart = {
            type:config.END_CALL_PEER_FROM_EXTNESION,
            data:{timer:this.props.timeAloted,
            profilePic:this.props.otherPersonPic}
        }
        if (this.props.extSource !== null) {
            source.postMessage(callStart, origin);
        }
                console.log("ending the call")
                if (peer !== null) {
                    console.log("destroying peer")
                    peer.destroy();
                    this.setState({
                        peerId: null,
                        peer: null,
                        manualClose: true
                    })
                }
                if (!self.state.initiatedCloseCall) {
                    console.log("stoping share")
                  
                    self.stopShare()
                    self.setState({
                        initiatedCloseCall: true
                    })
                }
                else{
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
                        twitterHandle: self.props.callerTwitterHandle
                    })
            }
        })
    }
    

    componentWillMount() {

        this.props.stillAuthenicated();
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
      

        this.setState({
            socket: this.props.socket
        });
        var self = this;
        var peer = new window.Peer()
        
        this.setState({
            peer: peer
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
                audio.srcobject = stream

                self.props.startSecodScreenShare(stream)

            })
        })
        peer.on('connection', (conn) => {
            if(config.CALL_LOGS)
            console.log("connected : ", conn)
            conn.on('open', () => {
                this.setState({
                    clickedOnLink: true
                })
                const result = browser();
                if(config.CALL_LOGS)
                console.log("sending acknowledge message ", conn)
                conn.send({
                    data:"sendID"
                })
                conn.on('data', (data) => {
                    if(config.CALL_LOGS)
                    self.setState({
                        destkey: data.clientId,
                    })
                    console.log("cpnnection established recieved data : ",data)
                    if (result.name === "chrome") {
                        self.receiveMessage()
                    }
                    else if (result.name === "firefox") {
                        self.startScreenShareSend()
                    }
                 


                });

            });
        });

        peer.on('disconnected', function () {
            if (!self.state.initiatedCloseCall) {
                self.stopShare()
                self.setState({
                    initiatedCloseCall: true
                })

            }
        });
        // peer.on('close', function () {
        //     if (!self.state.initiatedCloseCall) {
        //         self.stopShare()
        //         self.setState({
        //             initiatedCloseCall: true
        //         })

        //     }
        // });


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
        var socket = this.state.socket
        var self = this
        this.setState({
            myscreenSharing: true
        })
        socket.emit(config.ACCEPT_SHARE_OTHRT_PEER_SCREEN, {
            'otherPeerId': self.state.peerId
        })
    }

    peerCall() {

        var self = this
        var socket = this.state.socket
        var peer = this.state.peer
        var finalStream = this.state.finalStream
        if(config.CALL_LOGS)
        console.log("calling...")
        var call = peer.call(this.state.destkey, finalStream);
        var recorder1 = RecordRTC(finalStream, {
            type: 'video'
        });
       
        recorder1.startRecording();

        if (call) {
            call.on('stream', function (remoteStream) {
                self.props.fullStartedSharing()
                if(config.CALL_LOGS)
                console.log("call success full")
                var audio = document.querySelector('#video');
                audio.srcObject = remoteStream
                audio.play()
                self.setState({
                    connected: true
                })

            }, function (err) {
                console.log('Failed to get local stream', err);
            });
            call.on('close', function () {
                if (!self.state.initiatedCloseCall) {
                    self.stopShare()
                    self.setState({
                        initiatedCloseCall: true
                    })

                }
                socket.emit(config.CLOSE_NETWORK_ISSUE, {
                    'otherPeerId': self.state.peerId
                })
            })
        }
        this.setState({
            recorder: recorder1
        })
    }


    discard = () => {
        setTimeout(() => {
            window.close()
        }, 300);
    }

    renderer = ({ hours, minutes, seconds, completed }) => {
        localStorage.setItem("timer",(minutes + (seconds / 60)))
        var curTime = (minutes + (seconds / 60))
        if(curTime!== 3)
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
        if (!navigator.onLine) {
            console.log("no intenet")
            self.setState({
                noInternet: true
            })
        }

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
    savefilePrivate(otherAudioBlob) {
        
        this.setState({ saveinitiated: true })
        var resultingBlob = this.concatinateBlob(otherAudioBlob)
        console.log("resultingBlob : ",resultingBlob)
      
        var peer = this.state.peer;
        if (peer !== null) {
            peer.destroy();
            this.setState({
                peer: null
            })
        }
    }
    concatinateBlob(otherAudioArrayBuffer){
        var blobArray = [];
        var self = this;
     
        var otherAudioBlob = new Blob([otherAudioArrayBuffer],{type : 'video/webm'})
            blobArray.push(this.state.blob);
            console.log("local blob : ", this.state.blob)
            blobArray.push(otherAudioBlob);
            console.log("foriegn blob :", otherAudioBlob)
            console.log("blobAraay : ",blobArray)
            window.ConcatenateBlobs(blobArray, 'video/webm', function(resultingBlob) {
                console.log("resulting blob : ", resultingBlob)
                self.props.savefile(resultingBlob, 0, self.props.callTopic)
            });
    }
    recordCallAfterShare() {

        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.displayFullScrenRecord()
        this.props.fromShareToRecord()
    }
    recordCall() {
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.displayFullScrenRecord();
        this.props.fromShareToRecord();
    }
    saveClicked() {
        this.setState({
            isSaveClicked: true
        })
    }
    tweetToParicipant() {

        this.props.sendTweet(
            this.props.callerTwitterHandle,
            this.props.recieverTwitterHandle,
            this.props.sharablelink
        )
        this.setState({
            tweetBtnPressed: true
        })
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
        // this.props.makeTwitterCall(RecievertwitterHandle)
        var peerId = this.state.peerId;
        var shareScreenLink = config.react_url + '/connect/' + peerId;
        this.setState({
            shareScreenLink: shareScreenLink
        })
        setTimeout(() => {
            if (!this.state.answerFrmPeer || !this.state.clickedOnLink) {
                    self.props.callFailedUpdate(self.props.touser,self.props.callTopic)
                    self.setState({
                        timeOutNoAnswerOnCAll: true
                    })
                socket.emit(config.ENDING_RING, {
                    'fromUserId': this.props.userId,
                    'ToUserId': this.props.twitterUserId
                })
            }
        }, 20000)
        var socket = this.state.socket;
        this.props.basicInfoCall(this.props.twitterUserId)
        socket.emit(config.LINK_TO_CALL, {
            'link': shareScreenLink,
            'fromEmail': this.props.email,
            'fromUserName': this.props.userName,
            'fromProfilePic': this.props.profilePic,
            'fromUserId': this.props.userId,
            'ToUserId': this.props.twitterUserId
        })
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
        console.log("i am hitting here")
        var source = this.props.extSource
        var origin = this.props.extOrigin
        const callStart = {
            type:config.END_CALL_PEER_FROM_EXTNESION,
            data:{timer:this.props.timeAloted,
            profilePic:this.props.otherPersonPic}
        }
        if (this.props.extSource !== null) {
            source.postMessage(callStart, origin);
        }
        if (!this.state.stopedSharing) {
            this.setState({
                stopedSharing: true
            })
            var call = this.state.call;
            if (call != null)
                setTimeout(() => {
                    call.close();
                }, 400);
            if (!this.state.closedHere && !this.state.timerEnded)
                this.setState({
                    showDisconectMessage: true
                })
            this.setState({
                clickedOnLink: false
            })
            if (this.props.isSceenSharing)
                this.props.fullStopedSharing();
            var self = this;
            var recorder1 = this.state.recorder;

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

            if (recorder1 != null)
                recorder1.stopRecording(function () {
                    var blob = recorder1.getBlob();
                    self.setState({
                        downloadUrl: URL.createObjectURL(blob),
                        blob: blob
                    })
                    self.props.saveVideoBlob(blob)
                });
            self.props.endSecondScreenShare()
            this.setState({
                isShareDone: true,
                isAudioRecDone: true,
                clickedOnLink: false,
                isRecording: "",
                recorder: null,
                audioStream: null,
                canvasStream: null,
                call: null,
                peercalled: false
            })
        }

    }
    sendLink(){
        var self = this;
       this.props.initiateSend()
        var socket =  this.state.socket
        var sharableLinkSaved = this.props.sharablelink
        console.log("sending sharable link")
        socket.emit(config.SEND_SHARABLE_LINK, {
            'otherPeerId': self.props.peerId,
            'sharableLink':sharableLinkSaved
        })
        var duration = durationInMinutes(this.props.initialTime,this.props.noOfIncreaseInTime,this.props.currentTimeLeft);

        callSuccessedUpate(this.props.touser, this.props.callTopic,duration,sharableLinkSaved)
    }
    downloadExtension() {
        window.open(config.EXTENSION_URL, "_self")

    }

    render() {
        if(this.props.isSaved){
            if(!this.props.sendinitiated){
                this.sendLink()
            }
        }
        const audioWarning=(this.props.isSceenSharing && this.props.currentTimeLeft<0.166)?(<audio style={{ display: "none" }} autoPlay  loop src={require('../../audio/time_out.wav')}></audio>):(null)

        const closeFunction = (this.props.isSceenSharing) ? this.props.reStoreDefault :
            this.props.closeImidiate
        var linkElement = null;
        var buttons=null;
        var savingMsg = (this.state.saveinitiated && !this.props.isSaved)?(
            <div>
                <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                <span>Saving the session..</span></div>):(
        (this.props.isSaved)?(<span>call saved in created section</span>):(null)
        )
        var MessageDisconnected = null;
        var shareTimeElements = null;
        var postShareElements = null;
        const closeBtn = (!this.props.isSceenSharing) ?
            ((((this.props.isSharingCompleted)) || this.state.doneCalling || this.state.answerFrmPeer) ? (null) : (<Button style={{ margin: "5px" }} close onClick={closeFunction} />)) :
            (null)
      
        var noInternet = null
        if (this.state.noInternet)
            noInternet = "No Intenet conecticvity"
        else noInternet = null;
        if (this.state.timerEnded ) {
            MessageDisconnected = (
                <div>
                    <p><b>Call ended as the time alloted ended</b></p>
                    <p>You need to share a new link to connect again</p>
                    {savingMsg}
                </div>)
        }
        else if (this.state.showDisconectMessage && !this.state.closedHere && this.state.manualClose) {
            MessageDisconnected = (<div>
                <p><b>Call ended from other peer</b></p>
                {savingMsg}

            </div>)
        }
        else if (!this.state.manualClose  && !this.state.timerEnded && !this.state.retry && (this.state.retryLimit < 1)) {
            buttons = (!this.state.saveinitiated) ?
                (<div><span className="hint--bottom" aria-label="Retry">
                    <MdReplay className="icons" onClick={this.retryCall} />
                </span>
                    <span className="hint--bottom" aria-label="Record call and send">
                        <FiVideo className="icons" onClick={this.recordCall} />
                    </span>
                    <span className="hint--bottom" aria-label="End Call Session">
                        <FiX className="icons" onClick={this.savefilePrivate} />
                    </span>
                </div>) : (null)
            MessageDisconnected = (
                <div>
                    <p><b>Call disconnected due to network issues</b></p>
                    {buttons}
                    {savingMsg}
                </div>
            )
        }

        else if (!this.state.manualClose && this.state.timerEnded && !this.state.retry && (this.state.retryLimit < 1)) {
            buttons = (!this.state.saveinitiated) ?
                (<div><span className="hint--bottom" aria-label="Retry">
                    <MdReplay className="icons" onClick={this.retryCall} />
                </span>
                    <span className="hint--bottom" aria-label="Record call and send">
                        <FiVideo className="icons" onClick={this.recordCall} />
                    </span>
                    <span className="hint--bottom" aria-label="End Call Session">
                        <FiX className="icons" onClick={this.savefilePrivate} />
                    </span>
                </div>) : (null)
            MessageDisconnected = (
                <div>
                    {buttons}
                    {savingMsg}
                </div>
            )
        }
        else if (!this.state.manualClose  && !this.state.retry)
        {
            buttons=(!this.state.saveinitiated) ?(<div>
                <span className="hint--bottom" aria-label="Record call and send">
                        <FiVideo className="icons" onClick={this.recordCall} />
                    </span>
                    <span className="hint--bottom" aria-label="End Call Session">
                        <FiX className="icons" onClick={this.savefilePrivate} />
                    </span>
            </div>):(null)
            MessageDisconnected = (
                <div>
                    <p><b>Call ended due to network issues</b></p>
                    <p>You can reord the screen and send it</p>
                    {buttons}
                    {savingMsg}

                </div>
            )
        }
        else if (this.state.retry  && !this.state.retryTimeOut && !this.state.noInternet)
            MessageDisconnected = (
                <div>
                    <p><b>Reconnecting..</b></p>

                </div>
            )
        else if (this.state.retry && (this.state.retryTimeOut || this.state.noInternet))
        {
           buttons=(!this.state.saveinitiated)? (
           <div>
               <span className="hint--bottom" aria-label="Record call and send">
            <FiVideo className="icons" onClick={this.recordCall} />
        </span>
          <span className="hint--bottom" aria-label="End Call Session">
          <FiX className="icons" onClick={this.savefilePrivate} />
      </span>
      </div>):(null)
            MessageDisconnected = (
                <div>
                    <p><b>Retry failed</b><br />{noInternet}</p>
                    <p>You can reord the screen and send it</p>
                    {buttons}
                   {savingMsg}
                </div>
            )
        }
        else  {
            if (!this.state.saveinitiated  && this.state.blob!==null) { this.savefilePrivate() }
            MessageDisconnected = (<div>
                <p><b>Call ended</b></p>
                {savingMsg}

            </div>)
        }

        if (this.props.isSceenSharing) {

            var recieverProfPic = (this.props.twirecieverPrfilePic === null) ?
                (this.state.recieverProfilePic) :
                (this.props.twirecieverPrfilePic)

            const recieveProfileName = (this.props.twitterName === null) ?
                (this.state.recieverProfileName) : (this.props.twitterName)

            const recieverProfileId = (this.props.twitterUserId !== null) ? (
                this.props.twitterUserId
            ) : (this.state.recieverProfileId)


            shareTimeElements = (
                <div>
                    <Call
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

        if (this.props.isSharingCompleted && this.state.blob!==null && !this.state.clickedOnLink) {
            postShareElements = (<div className="DisconMessage">
                {MessageDisconnected}

            </div>)
        }


        if (!this.state.doneTweeting &&
            !this.state.doneCalling &&
            !this.props.isSceenSharing &&
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            !this.state.timeOutNoAnswer &&
            !this.state.answerFrmPeer &&
            !this.state.timeOutNoAnswerOnCAll)
            linkElement = (
                <div>
                    <LinkDisplay
                        doneCalling={this.state.doneCalling}
                        makeCallAction={this.makeCallAction}
                        expireTimer={this.expireTimer}
                        closeImidiate={this.props.closeImidiate}
                        recordCallAfterShare={this.recordCallAfterShare}
                        shareScreenLink={this.state.shareScreenLink}
                        changeTweetStatePos={this.changeTweetStatePos}
                        doneTweeting={this.state.doneTweeting} />
                </div>)
        else if (this.state.doneTweeting &&
            !this.state.doneCalling &&
            !this.props.isSceenSharing &&
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            !this.state.timeOutNoAnswer &&
            !this.state.answerFrmPeer &&
            !this.state.timeOutNoAnswerOnCAll) {

            linkElement = (<div>
                <div className="waitMsg">
                    <p>Wainting for peer to accept the Screen Share request</p>
                </div>
                <div className="callerImageDiv">
                    <CallImage
                        action="waiting" callerImageUrl={this.props.profilePic}
                        recieverImageUrl={this.props.twirecieverPrfilePic} />
                </div>
            </div>)
        }
        else if (!this.state.doneTweeting &&
            this.state.doneCalling &&
            !this.props.isSceenSharing &&
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            !this.state.timeOutNoAnswer &&
            !this.state.answerFrmPeer &&
            !this.state.timeOutNoAnswerOnCAll) {
            linkElement = (<div>
                <div className="waitMsg">
                    <p>Waiting for <b>{this.props.twitterName}</b> to accept the Screen Share request, if not we can drop a recorded message</p>
                </div>
                <div className="callerImageDiv">
                    <CallImage
                        action="waiting" callerImageUrl={this.props.profilePic}
                        recieverImageUrl={this.props.twirecieverPrfilePic} />
                </div>
            </div>)
        }
        else if (!this.props.isSceenSharing &&
            this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            !this.state.timeOutNoAnswer &&
            !this.state.answerFrmPeer &&
            !this.state.timeOutNoAnswerOnCAll)
            linkElement = (<div>
                <audio autoPlay style={{ display: "none" }} src={require('../../audio/brute-force.mp3')}></audio>

                <div className="waitMsg">
                    <p><b>{this.props.twitterName} has accepted the request</b></p>
                </div>
                <div className="callerImageDiv">
                    <CallImage
                        action="waiting" callerImageUrl={this.props.profilePic}
                        recieverImageUrl={this.props.twirecieverPrfilePic} />
                </div>
            </div>)

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
                    <FiVideo className="icons" onClick={this.recordCallAfterShare} />
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
                    <FiVideo className="icons" onClick={this.recordCallAfterShare} />
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
                    <FiVideo className="icons" onClick={this.recordCall} />
                </span>                <span className="hint--bottom" aria-label="Cancel">
                    <FiX className="icons" onClick={this.props.closeImidiate} />
                </span>

            </div>)

        return (this.state.isInstalled) ? (
            <div>
                {/* {backArrow} */}
                {closeBtn}
                {audioWarning}
                <div className="LinkDisplay">
                    {linkElement}
                    {shareTimeElements}
                    {postShareElements}
                    <audio id="video" ref={a => this.videoTag = a} srcobject=" " ></audio>
                </div>
                {/* <audio id="video" ref={a => this.videoTest = a} srcobject=" " ></audio> */}

            </div>

        ) : (<div >
            {/* <Navbar /> */}
            <div className="messageToDownload">
                <h3>Please download the chrome extension to continue</h3>
                <button className="buttonDark" onClick={this.downloadExtension}>Download Extension</button>
            </div>
        </div>
            )
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
    callFailedUpdate : PropType.func.isRequired,
    basicInfoCall:PropType.func.isRequired,
    initiateSend:PropType.func.isRequired,
    // saveRecorder:PropType.func.isRequired
}
const mapStateToProps = state => ({
  
    peerId:state.call.peerId,
    isSharingCompleted: state.tools.isFullSharingCompleted,
    isSceenSharing: state.tools.isFullScreenSharing,
    isSaved: state.issues.successCreation,
    initialTime:state.call.initialTime,
    currentTimeLeft:state.call.currentTimeLeft,
    noOfIncreaseInTime:state.call.noOfIncreaseInTime,
    sharablelink: state.issues.sharablelink,
    extSource: state.extension.source,
    extOrigin: state.extension.origin,
    extSourceId: state.extension.sourceId,
    audioStream: state.stream.audioStream,
    screenStream: state.stream.screenStream,
    finalStream: state.stream.finalStream,
    profilePic: state.auth.profilePic,
    email: state.auth.email,
    userName: state.auth.userName,
    twirecieverPrfilePic: state.twitterApi.twitterProfilePic,
    twitterName: state.twitterApi.name,
    twitterUserId: state.twitterApi.twitterId,
    callerTwitterHandle: state.auth.twitterHandle,
    recieverTwitterHandle: state.twitterApi.twitterHandle,
    tweetSuccess: state.twitterApi.tweeetSent,
    twitterSendDone: state.twitterApi.tweetDone,
    userId: state.auth.id,
    callTopic:state.call.topicOfTheCall,
    noOfMinutes: state.call.noOfMinutes,
    startSecodScreenShare: state.secondScreenShare.secondScreenShareStarted,
    secodShareStream: state.secondScreenShare.stream,
    touser:state.call.touser,
    sendinitiated:state.call.sendinitiated,
    otherPeerRecorder:state.recorder.otherPeerRecorder


})

export default connect(mapStateToProps, {
    resetValues,
    displayFullScrenRecord,
    sendTweet,
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
    // saveRecorder,
    basicInfoCall,
    updateCurrentTime,
    stillAuthenicated,
    endSecondScreenShare,
    fromShareToRecord,
    callFailedUpdate,
    updateRemainingTime
})(ScreenRecorder)
