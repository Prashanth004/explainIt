import React, { Component } from 'react'
import RecordRTC from 'recordrtc'
import Dummy from './dummy'
import { setStream } from '../../../actions/streamActions'
import { saveSourceId } from "../../../actions/extensionAction";
import config from '../../../config/config'
import '../../css/shareScreen.css'
import CopyToClipboard from '../CopytoClipboard';
import socketIOClient from "socket.io-client";
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
import { getRecpientId, resetValues } from '../../../actions/twitterApiAction'

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
            twitterHandle: null,
            tweetTested: false,
            noInternet: false

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
        this.testHandle = this.testHandle.bind(this);
        this.updateTwitterHandleBox = this.updateTwitterHandleBox.bind(this)
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

        this.stopShare()



    }
    receiveMessage() {
        var source = this.props.extSource
        var origin = this.props.extOrigin
        if (this.props.extSource !== null) {
            source.postMessage('audio-plus-tab', origin);
        }
    }

    componentDidMount() {
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
        //acceptinf acknowlegment from other peer for call starting
        socket.on(config.CALL_ACK_MESSAGE, data => {
            console.log(" data from client ack : ", data)
            if (data.clientId === self.state.peerId) {
                //    alert("got ack")
                this.setState({
                    CallAck: true
                })
            }

        })
        // acepting message of ending call
        socket.on(config.END_CALL, data => {
            console.log(" data from end call process : ", data)
            if (data.clientId === self.state.destkey) {
                this.stopShare()
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
                    msg: "token valid"
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
                    // alert("con close")
                    if (!self.state.initiatedCloseCall) {
                        self.stopShare()
                        self.setState({
                            initiatedCloseCall: true
                        })

                    }

                })
            });
        });
        peer.on('disconnected', function () {
            //   if(!self.state.initiatedCloseCall){
            //     self.stopShare()
            //     self.setState({
            //         initiatedCloseCall : true
            //     })

            //    }
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
            this.setState({
                timerEnded: true
            })
            this.stopShare()
            return (<Dummy></Dummy>)
        } else {
            // Render a countdown
            return <span>{hours}:{minutes}:{seconds}</span>;
        }
    };

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
        // alert("unmounting")
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

    testHandle() {
        this.setState({
            tweetTested: true
        })
        this.props.getRecpientId(this.state.twitterHandle)
    }
    updateTwitterHandleBox(e) {
        this.setState({
            twitterHandle: e.target.value
        })
    }
    tweetTheMessage() {
        var sharableURL = this.state.shareScreenLink
        var text = "@" + this.state.twitterHandle + " This is an invite link to join my screen share";
        var encSharableURL = encodeURI(sharableURL);
        var encText = encodeURI(text);

        var href = "https://twitter.com/intent/tweet?text=" + encText + "&url=" + encSharableURL
        var width = 555,
            height = 300,
            top = window.innerHeight / 4,
            left = window.innerWidth / 4,
            url = href,
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left;
        window.open(url, 'twitter', opts);

        this.props.resetValues();
        this.setState({
            tweetTested: false
        })

    }

    stopShare() {
        var call = this.state.call;
        var peer = this.state.peer;


        if (call != null) {
            setTimeout(() => {
                call.close();
            }, 400);
        }
        if (!this.state.closedHere && !this.state.timerEnded) {
            this.setState({
                showDisconectMessage: true
            })
        }
        this.setState({
            clickedOnLink: false
        })
        if (this.props.isSceenSharing) {
            this.props.fullStopedSharing();
        }

        var self = this;
        var peer = this.state.peer;
        var recorder1 = this.state.recorder;

        var audioStream = this.props.audioStream;
        var screenStream = this.props.screenStream;
        var audioStreamLocal = this.state.audioStream;
        var screenStreamLocal = this.state.screenStream;
        if (audioStream !== null) {
            audioStream.stop();
        }
        if (screenStream != null) {
            screenStream.stop();
        }

        if (audioStreamLocal !== null) {
            audioStream.stop();
        }
        if (screenStreamLocal != null) {
            screenStream.stop();
        }
        var audio = document.querySelector('#video');
        audio.src = "";
        console.log("recorder1 : ", recorder1)
        if (recorder1) {
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
        }
        else {

        }

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

    render() {
        var validatinginfo = null
        var noInternet = null
        if (this.state.noInternet) {
            noInternet = "No Intenet conecticvity"
        }
        else {
            noInternet = null
        }
        if (this.state.tweetTested && !this.props.doneFetching) {
            validatinginfo = (<p className="info">checking handle validity</p>)
        }
        if (this.props.doneFetching && this.props.twitterHandleValid) {
            this.tweetTheMessage()
        }
        if (this.state.tweetTested && this.props.doneFetching && !this.props.twitterHandleValid) {
            validatinginfo = (<div>
                <p className="info">Incorrect twitter handle<br />
                    Please check and try again</p>
            </div>
            )
        }

        if (this.state.timerEnded) {
            var MessageDisconnected = (<p><b>Dissconected as the call exceded 3 mins</b></p>)
        }
        if (this.state.showDisconectMessage && !this.state.closedHere && this.state.manualClose) {
            var MessageDisconnected = (<p><b>Disconnected from other peer</b></p>)
        }
        else if (!this.state.manualClose && !this.state.retry && (this.state.retryLimit < 1)) {
            var MessageDisconnected = (
                <div>
                    <p><b>Call ended due to network issues</b></p>
                    <button className="buttonDark" onClick={this.retryCall}>Retry</button>
                    <button className="buttonDark " onClick={this.recordCall}>Record</button>
                    <button className="buttonDark">Cancel</button>
                </div>
            )
        }
        else if (!this.state.manualClose && !this.state.retry) {
            var MessageDisconnected = (
                <div>
                    <p><b>Call ended due to network issues</b></p>

                    <p>You can reord the canvas and send it</p>
                    <button className="buttonDark" onClick={this.recordCall}>Record</button>
                    <button className="buttonDark" onClick={this.props.reStoreDefault}>Cancel</button>
                </div>
            )
        }
        else if (this.state.retry && !this.state.retryTimeOut && !this.state.noInternet) {
            var MessageDisconnected = (
                <div>
                    <p><b>Reconnecting..</b></p>

                </div>
            )
        }
        else if (this.state.retry && (this.state.retryTimeOut || this.state.noInternet)) {
            var MessageDisconnected = (
                <div>
                    <p><b>Retry failed</b><br />{noInternet}</p>
                    <p>You can reord the canvas and send it</p>
                    <button className="buttonDark" onClick={this.recordCall}>Record</button>
                    <button className="buttonDark" onClick={this.props.reStoreDefault}>Cancel</button>
                </div>
            )
        }
        else {
            var MessageDisconnected = <p><b>Call ended</b></p>
        }
        var timer = null;
        var videoplayer = " ";
        var downLinkAudio = " ";
        var linkElement = " ";
        if (this.props.isSceenSharing) {
            // timer = (<Countdown
            //     date={Date.now() + 180000}
            //     renderer={this.renderer}
            // />)
            var shareTimeElements = (
                <div>
                    <div className="recordHolder">
                        {/* {timer} */}

                        <button className="Rec"></button>
                    </div>
                    <p>Sharing the screen...</p>
                    <button onClick={this.endCall} className="stopButton">End sharing</button>
                    {/* <div id="main-circle">
                    <div onClick ={this.endCall}id="inner-circle">END</div>
                </div> */}
                </div>
            )
        }
        if (this.state.clickedOnLink && !this.props.isSceenSharing && !this.state.CallAck) {
            if (this.state.retryLimit === 0) {
                var shareTimeElements = (<div className="clickedMessage">
                    <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                    <p><b>Link clikced</b></p>
                    <p>Connecting.. </p>
                </div>)
            }
            else {
                var shareTimeElements = (<div className="clickedMessage">
                    <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                    <p>Connecting.. </p>
                </div>)
            }

        }
        if (this.state.clickedOnLink && !this.props.isSceenSharing && this.state.conDidNotInitiate) {
            var shareTimeElements = (<div className="clickedMessage">
                <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                <p><b>Failed To connect</b></p>
                <p>This happened due to network issues</p>
            </div>)
        }
        if (this.props.isSharingCompleted && !this.state.clickedOnLink && !this.props.isSaved) {
            var postShareElements = (<div>
                {MessageDisconnected}

            </div>)
            {/* {MessageDisconnected}
                     <p>Do you want to save the call for referring later?</p>
                     <button onClick={this.savefile} className="buttonLight save">
                       Save
                     </button>
                     <button onClick={this.discard}className="buttonDark save">
                         Discard
                     </button>
                 </div>) */}
        }
        {/* else if(this.props.isSaved){
            var postShareElements= (<div className = "postRecord">
          
                 <p>Link to access your saved project</p>

                 <CopyToClipboard sharablelink = {this.props.sharablelink} />
             </div>)
        } */}
        if (this.state.downloadUrl) {
            videoplayer = (<video src={this.state.downloadUrl} controls={true}></video>)

            downLinkAudio = (<div>
                <a href={this.state.downloadUrl} download="dmkmdvkmdkm">Download</a>
            </div>)
        }
        if (!this.props.isSceenSharing &&
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            this.state.timeOutNoAnswer) {
            var shareTimeElements = (<div className="clickedMessage">
                <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                <p><b>Link expired</b></p>
                <p>Client did not click to get connected</p>
            </div>)
        }

        if (this.state.shareScreenLink &&
            !this.props.isSceenSharing &&
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            !this.state.timeOutNoAnswer) {
            linkElement = (
                <div>
                    <div>
                        <p><b>Share the link below to get connected</b></p>
                        <p className="info">
                            <br />The link expires in 3 minutes
                    <br />You will be notified with a sound when peer clicks on the link</p>
                        <CopyToClipboard sharablelink={this.state.shareScreenLink} />
                    </div>
                    <div>
                        <p><b>Tweet it to twitter user to invite them to join the call</b></p>
                        <input type="text"
                            className="myInput"
                            placeholder="Enter twitter handle"
                            onChange={this.updateTwitterHandleBox}></input>
                        <button className="buttonDark" onClick={this.testHandle}>Tweet</button>
                        {validatinginfo}
                    </div>

                </div>)
        }
        return (

            <div className="LinkDisplay">
                {linkElement}
                {shareTimeElements}
                {postShareElements}
                <audio id="video" ref={a => this.videoTag = a} srcObject=" " ></audio>
            </div>
        )
    }
}
ScreenRecorder.PropType = {
    StartedSharing: PropType.func.isRequired,
    stopedSharing: PropType.func.isRequired,
    saveVideoBlob: PropType.func.isRequired,
    setStream: PropType.func.isRequired,
    saveSourceId: PropType.func.isRequired,
    restAllToolValue: PropType.func.isRequired,
    cancelAllMessageAction: PropType.func.isRequired,
    displayFullScrenRecord: PropType.func.isRequired,
    getRecpientId: PropType.func.isRequired,
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
    twitterHandleValid: state.twitterApi.profilePresent,
    doneFetching: state.twitterApi.doneFetching

})

export default connect(mapStateToProps, { getRecpientId, resetValues, displayFullScrenRecord, cancelAllMessageAction, restAllToolValue, saveSourceId, fullStartedSharing, setStream, fullStopedSharing, saveVideoBlob })(ScreenRecorder)