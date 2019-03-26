import React, { Component } from 'react'
import RecordRTC from 'recordrtc'
import { resetValues } from '../../../actions/twitterApiAction'
import { Button } from 'reactstrap'
import Dummy from './dummy'
import { setStream } from '../../../actions/streamActions'
import { saveSourceId } from "../../../actions/extensionAction";
import config from '../../../config/config'
import '../../css/shareScreen.css';
import CopyToClipboard from '../CopytoClipboard'
import { FaArrowLeft } from "react-icons/fa";
import CallImage from './CallImage'
import socketIOClient from "socket.io-client";
import TweetSearch from './tweetSearch';
import Call from './Call'
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
import { sendTweet } from '../../../actions/twitterApiAction'

class ScreenRecorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recorder: null,
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
            manualClose: false,
            retryLimit: 0,
            retry: false,
            initiatedCloseCall: false,
            noInternet: false,
            doneTweeting: false,
            stopedSharing: false,
            tweetBtnPressed: false

        }
        this.renderer = this.renderer.bind(this);
        this.stopShare = this.stopShare.bind(this);
        this.startScreenShareSend = this.startScreenShareSend.bind(this);
        this.generateLink = this.generateLink.bind(this);
        this.savefile = this.savefile.bind(this)
        this.receiveMessage = this.receiveMessage.bind(this);
        this.endCall = this.endCall.bind(this)
        this.retryCall = this.retryCall.bind(this);
        this.recordCall = this.recordCall.bind(this);
        this.changeTweetStatePos = this.changeTweetStatePos.bind(this);
        this.changeTweetStateNeg = this.changeTweetStateNeg.bind(this);
        this.closeButton = this.closeButton.bind(this);
        this.tweetToParicipant = this.tweetToParicipant.bind(this)

    }

    startScreenShareSend() {
        var self = this
        var sourceId = this.props.extSourceId;
        var ua = window.detect.parse(navigator.userAgent);

        if (ua.browser.family === "Chrome") {
            var constraints = {
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
            var constraints = {
                video: {
                    mediaSource: "screen",
                    width: { max: '1920' },
                    height: { max: '1080' },
                    frameRate: { max: '10' }
                }
            }
        }
        console.log("constrain set")
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (audioStream) {
            navigator.mediaDevices.getUserMedia(constraints).then(function (screenStream) {
                var finalStream = new MediaStream();
                window.getTracks(audioStream, 'audio').forEach(function (track) {
                    finalStream.addTrack(track);
                });

                window.getTracks(screenStream, 'video').forEach(function (track) {
                    finalStream.addTrack(track);
                });
                console.log("peer : ", peer)
                var peer = self.state.peer
                var call = peer.call(self.state.destkey, finalStream);
                var recorder1 = RecordRTC(finalStream, {
                    type: 'video'
                });
                recorder1.startRecording();
                self.props.setStream(audioStream, screenStream, finalStream)
                self.setState({
                    recorder: recorder1,
                    audioStream: audioStream,
                    screenStream: screenStream,
                    finalStream: finalStream,
                    call: call,
                    retry: false
                })
                if (call) {
                    call.on('stream', function (remoteStream) {
                        console.log("call answer recieved : ", remoteStream)
                        var audio = document.querySelector('#video');
                        audio.srcObject = remoteStream
                        audio.play()
                        self.setState({
                            connected: true
                        })

                    }, function (err) {
                        console.log('Failed to get local stream', err);
                    });


                }
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
            'peerId': this.state.peerId
        })
        if (peer !== null) {
            peer.destroy();
            this.setState({
                peerId: null,
                peer: null
            })
        }

        if (!self.state.initiatedCloseCall) {
            self.stopShare()
            self.setState({
                initiatedCloseCall: true
            })
        }



    }
    receiveMessage() {
        var source = this.props.extSource
        var origin = this.props.extOrigin
        if (this.props.extSource !== null) {
            source.postMessage('audio-plus-tab', origin);
        }
    }

    componentDidMount() {
        window.twttr.events.bind('click', function (e) {
            // Send GA event
            console.log(e);
        });
        var socket = this.state.socket;
        var self = this
        var peer = this.state.peer;

        function postMessageHandler(event) {
            console.log(" event :", event)
            if (event.data.sourceId !== undefined) {
                console.log("We've got a message!");
                console.log("* Message:", event.data);
                console.log("* Origin:", event.origin);
                console.log("* Source:", event.source);
                console.log("*event.data.message__sourceId : ", event.data.sourceId)
                self.props.saveSourceId(event.data.sourceId)
                self.startScreenShareSend()
            }

        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }

        setTimeout(() => {
            if (!this.state.clickedOnLink) {
                self.setState({
                    timeOutNoAnswer: true
                })
                if (peer !== null) {
                    peer.destroy()
                }


            }
        }, 3 * 60 * 1000)
        socket.on(config.CALL_ACK_MESSAGE, data => {
            console.log(" data from client ack : ", data)
            if (data.clientId === self.state.peerId) {
                this.setState({
                    CallAck: true
                })
            }

        })

        socket.on(config.END_CALL, data => {
            console.log(" data from end call process : ", data)
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

        socket.on(config.CHECK_TOKEN_VALIDITY, data => {

            console.log("confmessage : ", data)
            console.log(" ")
            if (data.clientId === self.state.peerId) {
                socket.emit(config.COMFIRM_TOKEN_VALIDITY, {
                    success: 1,
                    msg: "token valid",
                    profilePic: self.props.profilePic,
                    twitterHandle: self.props.callerTwitterHandle
                })
            }
        })
    }

    componentWillMount() {
        const socket = socketIOClient(config.base_dir);
        this.setState({
            socket: socket
        });

        var self = this;
        var peer = new window.Peer()
        this.setState({
            peer: peer
        });

        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            self.setState({
                peerId: id
            })
            self.generateLink()
        });

        peer.on('connection', (conn) => {
            conn.on('open', () => {
                console.log("got some data")
                this.setState({
                    clickedOnLink: true
                })
                //    setTimeout(()=>{
                //        if(!this.props.isSceenSharing && !self.props.isSharingCompleted && !self.props.CallAck){
                //             self.setState({
                //                 conDidNotInitiate: true
                //             })
                //        }
                //    },20*1000)
                conn.on('data', (data) => {
                    this.props.fullStartedSharing()
                    console.log("data : ", data)

                    self.setState({
                        destkey: data.clientId,
                    })
                    var ua = window.detect.parse(navigator.userAgent);
                    if (ua.browser.family === "Chrome") {
                        self.receiveMessage()
                    }
                    else if (ua.browser.family === "Firefox") {
                        self.startScreenShareSend()
                    }

                });
                conn.on('close', () => {
                    if (!self.state.initiatedCloseCall) {
                        self.stopShare()
                        self.setState({
                            initiatedCloseCall: true
                        })

                    }

                })
            });
        });

        peer.on('error', function (err) { });
        peer.on('close', function () {
            if (!self.state.initiatedCloseCall) {
                self.stopShare()
                self.setState({
                    initiatedCloseCall: true
                })

            }
        });


    }


    discard = () => {
        setTimeout(() => {
            window.close()
        }, 1000);
    }

    renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {

            // Render a completed state
            this.stopShare()
            this.setState({
                timerEnded: true
            })
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
            doneTweeting: false
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

    savefile() {
        this.props.savefile(this.state.blob)
        var peer = this.state.peer;
        if (peer !== null) {
            peer.destroy();
            this.setState({
                peer: null
            })
        }
    }
    recordCall() {
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.displayFullScrenRecord()
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
            var audioStreamLocal = this.state.audioStream;
            var screenStreamLocal = this.state.screenStream;
            if (audioStream !== null)
                audioStream.stop();
            if (screenStream != null)
                screenStream.stop();
            if (audioStreamLocal !== null)
                audioStream.stop();
            if (screenStreamLocal != null)
                screenStream.stop();
            var audio = document.querySelector('#video');
            audio.src = "";
            console.log("recorder1 : ", recorder1)
            if (recorder1)
                recorder1.stopRecording(function () {
                    console.log("recorder 1 : ", recorder1)
                    var blob = recorder1.getBlob();
                    console.log("blob : ", blob)
                    self.setState({
                        downloadUrl: URL.createObjectURL(blob),
                        blob: blob
                    })
                    self.props.saveVideoBlob(blob)
                });
            this.setState({
                isShareDone: true,
                isAudioRecDone: true,
                clickedOnLink: false,
                isRecording: "",
                recorder: null,
                audioStream: null,
                canvasStream: null,
                call: null,
            })
        }

    }

    render() {
        var linkElement = " ";
        var backArrow = null
        var noInternet = null
        if (this.state.noInternet)
            noInternet = "No Intenet conecticvity"
        else noInternet = null;
        if (this.state.timerEnded && !this.props.isSaved)
            var MessageDisconnected = (
                <div>
                    <p><b>Dissconected as the call exceded 3 mins</b></p>
                    <button className="buttonDark" onClick={this.retryCall}>Retry</button>
                    <button className="buttonDark " onClick={this.recordCall}>Record</button>
                    <button className="buttonDark" onClick={this.savefile}>Save Call</button>
                    <button className="buttonDark">Discard</button>
                </div>)
        else if (this.state.showDisconectMessage && !this.props.isSaved && !this.state.closedHere && this.state.manualClose) {
            var MessageDisconnected = (<div>
                <p><b>Disconnected from other peer</b></p>
                <button className="buttonDark" onClick={this.savefile}>Save Call</button>
                <button className="buttonDark">Discard</button>
            </div>)
        }
        else if (!this.state.manualClose && !this.props.isSaved && !this.state.timerEnded && !this.state.retry && (this.state.retryLimit < 1))
            var MessageDisconnected = (
                <div>
                    <p><b>Call ended due to network issues</b></p>
                    <button className="buttonDark" onClick={this.retryCall}>Retry</button>
                    <button className="buttonDark " onClick={this.recordCall}>Record</button>
                    <button className="buttonDark" onClick={this.savefile}>Save Call</button>
                    <button className="buttonDark" onClick={this.props.reStoreDefault}>Discard</button>
                </div>
            )
        else if (!this.state.manualClose && !this.props.isSaved && this.state.timerEnded && !this.state.retry && (this.state.retryLimit < 1))
            var MessageDisconnected = (
                <div>
                    <p><b>Call ended due to network issues</b></p>
                    <button className="buttonDark" onClick={this.retryCall}>Retry</button>
                    <button className="buttonDark " onClick={this.recordCall}>Record</button>
                    <button className="buttonDark" onClick={this.savefile}>Save Call</button>
                    <button className="buttonDark" onClick={this.props.reStoreDefault}>Discard</button>
                </div>
            )
        else if (!this.state.manualClose && !this.props.isSaved && !this.state.retry)
            var MessageDisconnected = (
                <div>
                    <p><b>Call ended due to network issues</b></p>

                    <p>You can reord the canvas and send it</p>
                    <button className="buttonDark" onClick={this.recordCall}>Record</button>
                    <button className="buttonDark" onClick={this.savefile}>Save Call</button>
                    <button className="buttonDark" onClick={this.props.reStoreDefault}>Discard</button>
                </div>
            )
        else if (this.state.retry && !this.props.isSaved && !this.state.retryTimeOut && !this.state.noInternet)
            var MessageDisconnected = (
                <div>
                    <p><b>Reconnecting..</b></p>

                </div>
            )
        else if (this.state.retry && (this.state.retryTimeOut || this.state.noInternet))
            var MessageDisconnected = (
                <div>
                    <p><b>Retry failed</b><br />{noInternet}</p>
                    <p>You can reord the canvas and send it</p>
                    <button className="buttonDark" onClick={this.recordCall}>Record</button>
                    <button className="buttonDark" onClick={this.savefile}>Save Call</button>
                    <button className="buttonDark" onClick={this.props.reStoreDefault}>Discard</button>
                </div>
            )
        else if (!this.props.isSaved) {
            var MessageDisconnected = (<div>
                <p><b>Call ended</b></p>
                <button className="buttonDark" onClick={this.savefile}>Save Call</button>
                <button className="buttonDark" onClick={this.props.reStoreDefault} >Discard</button>
            </div>)
        }

        if (this.props.isSceenSharing) {
            // timer = (<Countdown
            //     date={Date.now() + 180000}
            //     renderer={this.renderer}
            // />)
            var shareTimeElements = (
                <div>

                    <Call renderer={this.renderer} endCall={this.endCall} otherPersonPic={this.props.twirecieverPrfilePic} />
                    {/* <div className="recordHolder">
                        {/* {timer} */}

                    {/* <button className="Rec"></button>
                    </div> */}

                    {/* <div id="main-circle">
                    <div onClick ={this.endCall}id="inner-circle">END</div>
                </div> */}
                </div>
            )
        }
        else if (this.state.clickedOnLink && !this.props.isSceenSharing && !this.state.CallAck)
            if (!this.state.retryLimit === 0)
                var shareTimeElements = (<div className="clickedMessage">
                    <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                    <p>Connecting.. </p>
                </div>)
            else if (this.state.clickedOnLink && !this.props.isSceenSharing && this.state.conDidNotInitiate)
                var shareTimeElements = (<div className="clickedMessage">
                    <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                    <p><b>Failed To connect</b></p>
                    <p>This happened due to network issues</p>
                </div>)

        //Post share elements
        if (this.props.isSharingCompleted && !this.state.clickedOnLink && !this.props.isSaved) {
            var postShareElements = (<div className="DisconMessage">
                {MessageDisconnected}

            </div>)
        }
        else if (this.props.isSaved) {
            if (!this.props.tweetSuccess && !this.state.tweetBtnPressed)
                var postShareElements = (<div className="postRecord">
                    {MessageDisconnected}
                    <p>Call is saved under created section</p>
                    <p>Do you want to tweet the recording to the other peer?</p>
                    <button className="buttonDark" onClick={this.tweetToParicipant}>Tweet</button>
                    <button className="buttonDark" onClick={this.props.reStoreDefault}>NO</button>
                </div>)
            else if (!this.props.tweetSuccess && this.state.tweetBtnPressed)
                var postShareElements = (<div className="postRecord">
                    <p>processing ..</p>
                </div>)
            else if (this.props.tweetSuccess) {
                var postShareElements = (<div className="postRecord">
                    <p>Tweeted successfully</p>
                </div>)
            }
        }

        if (!this.state.doneTweeting &&
            !this.props.isSceenSharing &&
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            !this.state.timeOutNoAnswer)
            linkElement = (
                <div>
                    <div>
                        {/* <p><b>Share the link below to get connected</b></p> */}
                        <p className="info">
                            <br />The link expires in 3 minutes
                    <br />You will be notified with a sound when peer clicks on the link</p>
                        {/* <CopyToClipboard sharablelink={this.state.shareScreenLink} /> */}
                    </div>
                    <div className="twitterLinkDiv">
                        <div className="twitterBird">
                            {/* <TiSocialTwitter /> */}
                            <div className="twitter">
                                <img width="100%" height="100%" src={require('../../images/twitter3.png')} />
                            </div>
                        </div>
                        {/* <p><b>Tweet it to twitter user to invite them to join the call</b></p> */}

                        <div className="twitterInput">
                            <TweetSearch channgeTeet={this.changeTweetStatePos} doneTweeting={this.state.doneTweeting} shareScreenLink={this.state.shareScreenLink} />
                        </div>
                    </div>
                </div>)
        else if (this.state.doneTweeting &&
            !this.props.isSceenSharing &&
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            !this.state.timeOutNoAnswer) {

            backArrow = (<FaArrowLeft onClick={this.changeTweetStateNeg} />)
            var linkElement = (<div>
                <div className="waitMsg">
                    <p><b>@{this.props.twitterName} has to still click on the link,
                       lets wait for sometime, if not we can drop a recorded message</b></p>
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
            !this.state.timeOutNoAnswer)
            var linkElement = (<div>
                <audio autoPlay style={{ display: "none" }} src={require('../../audio/brute-force.mp3')}></audio>

                <div className="waitMsg">
                    <p><b>@{this.props.twitterName} has clicked the link</b></p>
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
            this.state.timeOutNoAnswer)
            linkElement = (<div className="clickedMessage">
                <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                <p><b>Link expired</b></p>
                <p>Client did not click to get connected</p>
            </div>)

        return (
            <div>
                {backArrow}
                <Button close onClick={this.closeButton} />
                <div className="LinkDisplay">
                    {linkElement}
                    {shareTimeElements}
                    {postShareElements}
                    <audio id="video" ref={a => this.videoTag = a} srcObject=" " ></audio>
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
    resetValues: PropType.func.isRequired
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
    twirecieverPrfilePic: state.twitterApi.twitterProfilePic,
    twitterName: state.twitterApi.name,
    callerTwitterHandle: state.auth.twitterHandle,
    recieverTwitterHandle: state.twitterApi.twitterHandle,
    tweetSuccess: state.twitterApi.tweeetSent


})

export default connect(mapStateToProps, {
    resetValues,
    displayFullScrenRecord,
    sendTweet,
    cancelAllMessageAction,
    restAllToolValue,
    saveSourceId,
    fullStartedSharing,
    setStream,
    fullStopedSharing,
    saveVideoBlob
})(ScreenRecorder)
