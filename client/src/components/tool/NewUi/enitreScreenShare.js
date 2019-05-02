import React, { Component } from 'react'
import RecordRTC from 'recordrtc'
import { Button } from 'reactstrap'
import bigInt from "big-integer";

import { resetValues } from '../../../actions/twitterApiAction'
import Dummy from './dummy'
import { stillAuthenicated } from '../../../actions/signinAction';
import { setStream } from '../../../actions/streamActions'
import { saveSourceId } from "../../../actions/extensionAction";
import { startSecodScreenShare, endSecondScreenShare } from '../../../actions/secondShareAction'
import config from '../../../config/config';
import {fromShareToRecord} from '../../../actions/messageAction'
import '../../css/shareScreen.css';
import CallImage from './CallImage'
import browser from 'browser-detect';
import Call from './Call';
import { FiX, FiVideo } from "react-icons/fi";
import { MdReplay } from "react-icons/md";
import SaveElement from './Saveproject';
import {
    fullStartedSharing,
    fullStopedSharing,
    saveVideoBlob
} from '../../../actions/toolActions'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { restAllToolValue } from "../../../actions/toolActions";
import { cancelAllMessageAction } from '../../../actions/messageAction';
import { displayFullScrenRecord } from '../../../actions/toolActions'
import { sendTweet } from '../../../actions/twitterApiAction';
import LinkDisplay from './TweetAcceptHandle'

class ScreenRecorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recorder: null,
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
            ringAck:false,
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
            noOfMinutes: 3,
            isInstalled: true,
            maxTimeForVideo: null,
            secondShareStrem: null,
            answerFrmPeer: false,
            messageFrmPeer: null,
            timeOutNoAnswerOnCAll: false,
            videoStream:null,
            myscreenSharing:true
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
        this.tweetToParicipant = this.tweetToParicipant.bind(this);
        this.peerCall = this.peerCall.bind(this);
        this.saveClicked = this.saveClicked.bind(this);
        this.expireTimer = this.expireTimer.bind(this)
        this.setNoOfMinutes = this.setNoOfMinutes.bind(this);
        this.downloadExtension = this.downloadExtension.bind(this);
        this.makeCallAction = this.makeCallAction.bind(this);
        this.recordCallAfterShare = this.recordCallAfterShare.bind(this);
        this.shareMyScreen = this.shareMyScreen.bind(this)

    }
    setNoOfMinutes(minutes) {
        this.setState({
            noOfMinutes: minutes
        })
    }

    startScreenShareSend() {
        var self = this
        var constraints = null;
        var sourceId = this.props.extSourceId;
        var ua = window.detect.parse(navigator.userAgent);
        if (ua.browser.family === "Chrome") {
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
        else if (ua.browser.family === "Firefox") {
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

                var finalStream = new MediaStream();
                window.getTracks(audioStream, 'audio').forEach(function (track) {
                    finalStream.addTrack(track);
                });
                window.getTracks(screenStream, 'video').forEach(function (track) {
                    finalStream.addTrack(track);
                });
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
        var source = this.props.extSource
        var origin = this.props.extOrigin
        if (this.props.extSource !== null) {
            source.postMessage('audio-plus-tab', origin);
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
            if (event.data.sourceId !== undefined) {
              
                self.props.saveSourceId(event.data.sourceId)
                self.startScreenShareSend()
            }
        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }

        // setTimeout(() => {
        // if (!this.state.clickedOnLink) {
        //     if (peer !== null) {
        //         peer.destroy()
        //     }
        //     self.setState({
        //         timeOutNoAnswer: true,
        //         peer:null
        //     })

        // }
        // }, 3 * 60 * 1000)
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
        socket.on(config.ACCEPT_SHARE_OTHRT_PEER_SCREEN,data=>{
            if (data.otherPeerId === self.state.destkey) {
                self.setState({
                    myscreenSharing:false
                })
            }
        })
        socket.on(config.LINK_TO_CALL_ACK,data=>{

            if(data.fromUserId === this.props.userId){
                this.setState({
                    ringAck:true
                })
            }
        })
        socket.on(config.ENDING_RING_ACK,data=>{
            if(data.ToUserId === this.props.userId){
                self.setState({
                    timeOutNoAnswerOnCAll: true
                })
            }
        })
        socket.on(config.REJECT_REPLY, data => {
            if(data.toUserId === this.props.userId)
            self.setState({
                answerFrmPeer: true,
                messageFrmPeer: data.message
            })
        })
        socket.on(config.CLOSE_NETWORK_ISSUE, data => {
            if (data.otherPeerId === self.state.destkey) {
                self.stopShare()
                self.setState({
                    initiatedCloseCall: true
                })
            }
        })

        socket.on(config.END_CALL, data => {
            if (data.clientId === self.state.destkey) {
                if (!self.state.initiatedCloseCall) {
                    self.stopShare()
                    self.setState({
                        initiatedCloseCall: true
                    })
                }
            }
            if (peer !== null) {
                peer.destroy();
                this.setState({
                    peerId: null,
                    peer: null,
                    manualClose: true
                })
            }
        })

        socket.on(config.ENDCALL_ACK, data => {
            if (data.clientId === self.state.peerId) {
                this.stopShare()
            }
        })

        socket.on(config.CHECK_TOKEN_VALIDITY, data => {
            if (data.clientId === self.state.peerId) {
                if (self.state.peer !== null) {
                    socket.emit(config.COMFIRM_TOKEN_VALIDITY, {
                        success: 1,
                        msg: "token valid",
                        id: self.props.userId,
                        profilePic: self.props.profilePic,
                        twitterHandle: self.props.callerTwitterHandle
                    })
                }
            }
        })
    }

    componentWillMount() {
        this.props.stillAuthenicated();
        const result = browser();
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
       
        this.setState({
            socket: this.props.socket
        });
        var self = this;
        var peer = new window.Peer()
        this.setState({
            peer: peer
        });
        peer.on('open', (id) => {
            self.setState({
                peerId: id
            })
            self.generateLink()
        });
        peer.on('call', function (call) {

            call.answer()
            call.on('stream', function (stream) {
                self.setState({
                    videoStream:stream,
                    myscreenSharing:false
                })
                var audio = document.querySelector('#secondShareVideo');
                audio.srcObject = stream
            
                self.props.startSecodScreenShare(stream)
              
            })
        })
        peer.on('connection', (conn) => {
            conn.on('open', () => {
                this.setState({
                    clickedOnLink: true
                })
                var ua = window.detect.parse(navigator.userAgent);

                conn.on('data', (data) => {
                    if (ua.browser.family === "Chrome") {
                        self.receiveMessage()
                    }
                    else if (ua.browser.family === "Firefox") {
                        self.startScreenShareSend()
                    }
                    self.setState({
                        destkey: data.clientId,
                    })


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
    shareMyScreen(){
        var socket = this.state.socket
        var self = this
        this.setState({
            myscreenSharing:true
        })
        socket.emit(config.ACCEPT_SHARE_OTHRT_PEER_SCREEN,{
            'otherPeerId': self.state.peerId
        })
    }

    peerCall() {

        var self = this
        var socket = this.state.socket
        var peer = this.state.peer
        var finalStream = this.state.finalStream
        var call = peer.call(this.state.destkey, finalStream);
        var recorder1 = RecordRTC(finalStream, {
            type: 'video'
        });
        this.props.fullStartedSharing()
        recorder1.startRecording();

        if (call) {
            call.on('stream', function (remoteStream) {

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
        var socket = this.state.socket
        if (completed) {
            socket.emit(config.END_CALL, {
                'peerId': this.state.peerId,
                'timerEnded': true
            })
            if(!this.props.isSharingCompleted){
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
        }, 10000)
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
    savefilePrivate(textData) {
        var blob = this.state.blob
        this.props.savefile(blob, 0, textData)
        var peer = this.state.peer;
        if (peer !== null) {
            peer.destroy();
            this.setState({
                peer: null
            })
        }
    }
    recordCallAfterShare(){
       
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
    componentWillUnmount() {
        var peer = this.state.peer
        var recorder1 = this.state.recorder;
        var audioStream = this.state.audioStream;
        var screenStream = this.state.screenStream;
        this.setState({

        })
        if (audioStream !== null) {
            audioStream.stop();
        }
        if (screenStream != null) {
            screenStream.stop();
        }
        if (recorder1) {
            recorder1.stopRecording(function () {
            })
        }
        if (peer !== null) {
            peer.destroy()
        }

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
            if (!this.state.answerFrmPeer) {
                if(!this.state.ringAck){
                    self.setState({
                        timeOutNoAnswerOnCAll: true
                    })
                }
                socket.emit(config.ENDING_RING,{
                    'fromUserId': this.props.userId,
                    'ToUserId': this.props.twitterUserId
                })
            }
        }, 20000)
        var socket = this.state.socket
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
    downloadExtension() {
        window.open(config.EXTENSION_URL, "_self")

    }

    render() {
        const closeFunction = (this.props.isSceenSharing) ? this.props.reStoreDefault :
            this.props.closeImidiate
        var linkElement = null;
        var MessageDisconnected =null;
        var shareTimeElements = null; 
        var postShareElements = null;  
        // if()
        const closeBtn = (!this.props.isSceenSharing) ?
            (((( this.props.isSharingCompleted) && !this.props.isSaved)|| this.state.doneCalling ||  this.state.answerFrmPeer)?(null) :(<Button close onClick={closeFunction} />)):
            (null)
        const saveBtns = <SaveElement
          
            shareOrRec={config.SHARING}
            isSaveClicked={this.state.isSaveClicked}
            saveClicked={this.saveClicked}
            closeImidiate={this.props.closeImidiate}
            savefilePublic={this.savefilePublic}
            savefilePrivate={this.savefilePrivate} />
        var noInternet = null
        if (this.state.noInternet)
            noInternet = "No Intenet conecticvity"
        else noInternet = null;
        if (this.state.timerEnded && !this.props.isSaved)
            MessageDisconnected = (
                <div>
                    <p><b>Call ended as the it exceded {this.state.noOfMinutes} mins</b></p>
                    <p>You need to share a new link to connect again</p>
                    {saveBtns}
                </div>)
        else if (this.state.showDisconectMessage && !this.props.isSaved && !this.state.closedHere && this.state.manualClose) {
            MessageDisconnected = (<div>
                <p><b>Call ended from other peer</b></p>
                {saveBtns}

            </div>)
        }
        else if (!this.state.manualClose && !this.props.isSaved && !this.state.timerEnded && !this.state.retry && (this.state.retryLimit < 1))
            MessageDisconnected = (
                <div>
                    <p><b>Call disconnected due to network issues</b></p>
                    <span className="hint--bottom" aria-label="Retry">
                        <MdReplay className="icons" onClick={this.retryCall} />
                    </span>
                    <span className="hint--bottom" aria-label="Record call and send">
                        <FiVideo className="icons" onClick={this.recordCall} />
                    </span>
                    {saveBtns}

                </div>
            )
        else if (!this.state.manualClose && !this.props.isSaved && this.state.timerEnded && !this.state.retry && (this.state.retryLimit < 1))
            MessageDisconnected = (
                <div>
                    <p><b>Call disconnected due to network issues</b></p>
                    <span className="hint--bottom" aria-label="Retry">
                        <MdReplay className="icons" onClick={this.retryCall} />
                    </span>
                    <span className="hint--bottom" aria-label="Record call and send">
                        <FiVideo className="icons" onClick={this.recordCall} />
                    </span>
                    {saveBtns}

                </div>
            )
        else if (!this.state.manualClose && !this.props.isSaved && !this.state.retry)
            MessageDisconnected = (
                <div>
                    <p><b>Call ended due to network issues</b></p>
                    <p>You can reord the screen and send it</p>
                    <span className="hint--bottom" aria-label="Record call and send">
                        <FiVideo className="icons" onClick={this.recordCall} />
                    </span>
                    {saveBtns}

                </div>
            )
        else if (this.state.retry && !this.props.isSaved && !this.state.retryTimeOut && !this.state.noInternet)
            MessageDisconnected = (
                <div>
                    <p><b>Reconnecting..</b></p>

                </div>
            )
        else if (this.state.retry && (this.state.retryTimeOut || this.state.noInternet))
            MessageDisconnected = (
                <div>
                    <p><b>Retry failed</b><br />{noInternet}</p>
                    <p>You can reord the screen and send it</p>
                    <span className="hint--bottom" aria-label="Record call and send">
                        <FiVideo className="icons" onClick={this.recordCall} />
                    </span>
                    {saveBtns}

                </div>
            )
        else if (!this.props.isSaved) {
            MessageDisconnected = (<div>
                <p><b>Call ended</b></p>
                {saveBtns}

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
                        renderer={this.renderer}
                        endCall={this.endCall}
                        otherPersonPic={recieverProfPic}
                        otherPersonName={recieveProfileName}
                        otherPersonProfileId={recieverProfileId}
                        timeAloted={this.state.noOfMinutes}
                        secondShareStrem={this.state.secondShareStrem}
                    />
                </div>
            )
        }
        else if (this.state.clickedOnLink && !this.props.isSceenSharing && !this.state.CallAck)
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

        //Post share elements
        if (this.props.isSharingCompleted && !this.state.clickedOnLink && !this.props.isSaved) {
            postShareElements = (<div className="DisconMessage">
                {MessageDisconnected}

            </div>)
        }
        else if (this.props.isSaved) {
            if (!this.props.tweetSuccess && !this.state.tweetBtnPressed)
                postShareElements = (<div className="postRecord">

                    <p>Call is saved under your created section</p>

                </div>)
            else if (!this.props.tweetSuccess && this.state.tweetBtnPressed && this.props.twitterSendDone) {
                postShareElements = (<div className="postRecord">
                    <p>Tweeted Failed.</p>
                    <p>This could had have happened due to the repeated tweeting the same kind of message</p>
                    <span className="hint--bottom" aria-label="Retry Teet">
                        <MdReplay className="icons" onClick={this.tweetToParicipant} />
                    </span>
                </div>)
            }
            else if (!this.props.tweetSuccess && this.state.tweetBtnPressed)
                postShareElements = (<div className="postRecord">
                    <p>processing ..</p>
                </div>)

            else if (this.props.tweetSuccess && this.props.twitterSendDone) {
                postShareElements = (<div className="postRecord">
                    <p>Tweeted successfully</p>
                </div>)
            }

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
                        noOfMinutes={this.state.noOfMinutes}
                        setNoOfMinutes={this.setNoOfMinutes}
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
            ! this.state.answerFrmPeer&&
            !this.state.timeOutNoAnswerOnCAll)
            linkElement = (<div>
                <audio autoPlay style={{ display: "none" }} src={require('../../audio/brute-force.mp3')}></audio>

                <div className="waitMsg">
                    <p><b>{this.props.twitterName} has clicked the link</b></p>
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
            ! this.state.answerFrmPeer &&
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
                <div className="LinkDisplay">
                    {linkElement}
                    {shareTimeElements}
                    {postShareElements}
                    <audio id="video" ref={a => this.videoTag = a} srcobject=" " ></audio>
                </div>
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
    fromShareToRecord:PropType.func.isRequired
}
const mapStateToProps = state => ({

    isSharingCompleted: state.tools.isFullSharingCompleted,
    isSceenSharing: state.tools.isFullScreenSharing,
    isSaved: state.issues.successCreation,
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
    startSecodScreenShare: state.secondScreenShare.secondScreenShareStarted,
    secodShareStream: state.secondScreenShare.stream


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
    fullStopedSharing,
    saveVideoBlob,
    stillAuthenicated,
    endSecondScreenShare,
    fromShareToRecord
})(ScreenRecorder)
