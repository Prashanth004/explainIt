import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc'
import Dummy from './dummy'
import CopyToClipboard from '../CopytoClipboard';
import html2canvas from 'html2canvas'
import config from '../../../config/config'
import '../../css/shareScreen.css';
import socketIOClient from "socket.io-client";

import {
    StartedSharing,
    stopedSharing,
    saveVideoBlob
} from '../../../actions/toolActions'
import { connect } from 'react-redux';
import PropType from 'prop-types';

import Swal from 'sweetalert2';
import { InputGroup, InputGroupText, InputGroupAddon, Input } from 'reactstrap';
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
            conn: null,
            destkey: null,
            manualClose: false,
            socket: null,
            streamvideo: null,
            peer: null,
            initiatedCloseCall:false,
            peerId: null,
            connected: false,
            shareScreenLink: null,
            call: null,
            closedHere: false,
            showDisconectMessage: false,
            timerEnded: false,
            clickedOnLink: false,
            timeOutNoAnswer:false
        }
        this.renderer = this.renderer.bind(this);
        this.stopShare = this.stopShare.bind(this);
        // this.stopScreenShare = this.stopScreenShare.bind(this);
        this.startScreenShareSend = this.startScreenShareSend.bind(this);
        this.generateLink = this.generateLink.bind(this);
        this.savefile = this.savefile.bind(this)
        // this.copyToClipboard = this.copyToClipboard.bind(this);
        this.endCall = this.endCall.bind(this);
        // this.recordScreenStop = this.recordScreenStop.bind(this);
    }

    // copyToClipboard(e){
    //     if(e.target.id==="afterSave"){
    //         var copyText = document.querySelector('#savedLink');
    //         copyText.select();
    //     }
    //     else{
    //         var copyText = document.querySelector('.myInput');
    //         copyText.select();
    //     }

    //     document.execCommand("copy");
    //     this.setState({
    //         copyStatus:"link copied"
    //     })
    // }
    startScreenShareSend() {
        var self = this
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (audioStream) {
            var finalStream = new MediaStream();
            console.log("audio Stream : ", audioStream)
            window.getTracks(audioStream, 'audio').forEach(function (track) {
                finalStream.addTrack(track);
            });
            var canvasStream = " "
            var canvas = document.querySelector('canvas');
            canvasStream = canvas.captureStream(25);
            window.getTracks(canvasStream, 'video').forEach(function (track) {
                finalStream.addTrack(track);
            });
            var peer = self.state.peer
            var call = peer.call(self.state.destkey, finalStream);
            var recorder1 = RecordRTC(finalStream, {
                type: 'video'
            });
            recorder1.startRecording();
            self.setState({
                recorder: recorder1,
                audioStream: audioStream,
                canvasStream: canvasStream,
                finalStream: finalStream,
                call: call
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
                    self.props.startDraw()
                }, function (err) {
                    console.log('Failed to get local stream', err);
                });
                call.on('close', function () {
                    console.log("got closed message")
                    self.stopShare()
                })
            }
        }).catch(err => {
            console.log("error ouucres : ", err)
        })
    }

    componentWillMount() {
        const socket = socketIOClient(config.base_dir);
        this.setState({
            socket: socket
        })
        var self = this;
        var peer = new window.Peer()
        this.setState({
            peer: peer
        })
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            self.setState({
                peerId: id
            })
            self.generateLink()
        });



        peer.on('connection', (conn) => {
            conn.on('open', () => {

                this.setState({
                    clickedOnLink: true
                })
                conn.on('data', (data) => {
                    this.props.StartedSharing()
                    console.log("data : ", data)

                    self.setState({
                        destkey: data.clientId,
                    })
                    self.startScreenShareSend()
                });
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
        this.setState({
            peer: peer
        })
    }
    discard = () => {
        setTimeout(() => {
            window.close()

        }, 1000);
    }


    renderer = ({ hours, minutes, seconds, secondcalls, completed }) => {
        if (completed) {
            // Render a completed state
            this.setState({
                timerEnded: true
            })
            var call = this.state.call;
            this.stopShare()
            setTimeout(() => {
                call.close();
            }, 400)
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
    savefile() {
        this.props.savefile(this.state.blob)
    }
    componentDidMount() {
        var socket = this.state.socket;
        var self = this
        var peer = this.state.peer;
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
            this.setState({
                manualClose: true
            })
        })

        socket.on(config.CHECK_TOKEN_VALIDITY, data => {
            if (data.clientId === self.peerId) {
                socket.emit(config.COMFIRM_TOKEN_VALIDITY, {
                    success: 1,
                    msg: "token valid"
                })
            }
        })
    }
    componentWillUnmount() {

        this.stopShare()

    }
    endCall() {
        var socket = this.state.socket
        this.setState({
            closedHere: true,
            manualClose: true
        })
        socket.emit(config.END_CALL, {
            'peerId': this.state.peerId
        })
        this.stopShare()

    }
    stopShare() {
        if (!this.state.closedHere && !this.state.timerEnded) {
            console.log("I am here to show message")
            this.setState({
                showDisconectMessage: true
            })
        }
        setTimeout(() => {
            this.props.stopedSharing();
        }, 300)
        this.setState({
            clickedOnLink: false
        })

        var self = this;
        var peer = this.state.peer;
        var recorder1 = this.state.recorder;
        var audioStream = this.state.audioStream;
        var canvasStream = this.state.canvasStream;
        if ((audioStream || audioStream !== null) && (canvasStream || canvasStream !== null)) {
            audioStream.stop();
            canvasStream.stop();
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
            isRecording: "",
            recorder: null,
            audioStream: null,
            canvasStream: null,
        })
        if (peer !== null) {
            peer.destroy()
        }
    }

    render() {

        var timer = null;
        if (this.state.timerEnded) {
            var MessageAbtDisConect = (<p><b>Dissconected as the call exceded 3 mins</b></p>)
        }
        if (this.state.showDisconectMessage && !this.state.closedHere && this.state.manualClose) {
            var MessageAbtDisConect = (<p><b>Dissconected from other peer</b></p>)
        }
        else if (!this.state.manualClose) {
            var MessageAbtDisConect = <p><b>Call ended due to network issues</b></p>
        }
        else {
            var MessageAbtDisConect = (<p><b>Call ended </b></p>)
        }


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
                    <p>Sharing the canvas...</p>

                    <button onClick={this.endCall} className="stopButton">End sharing</button>
                </div>
            )
        }
        if (this.state.clickedOnLink && !this.props.isSceenSharing) {
            var shareTimeElements = (<div className="clickedMessage">
                <audio style={{ display: "none" }} autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                <p><b>Link clikced</b></p>
                <p>Connecting.. </p>
            </div>)
        }
        if (this.props.isSharingCompleted && this.props.isSaved == false && !this.state.clickedOnLink) {
            var postShareElements = (<div>
                {MessageAbtDisConect}
                {/* <p>Do you want to save the call for referring later?</p> */}
                {/* <button onClick={this.savefile} className="buttonLight save">
                       Save
                     </button>
                     <button onClick={this.discard}className="buttonDark save">
                         Discard
                     </button> */}
            </div>)
        }
        // else if(this.props.isSaved ){
        //     var postShareElements= (<div className = "postRecord">

        //         <p><b>The call has been successfuly saved in created list.</b></p>
        //          <p>Link to access your saved project</p>
        //          <CopyToClipboard sharablelink= {this.props.sharablelink} />
        //          {/* <input id="savedLink" className="myInput" type="text" value={this.props.sharablelink}/>
        //         <span class="hint--bottom" aria-label={this.state.copyStatus}>
        //             <button className="buttonDark" id="afterSave" onClick={this.copyToClipboard}>
        //             Copy text
        //             </button>
        //         </span> */}
        //      </div>)
        // }
        if (this.state.downloadUrl) {
            videoplayer = (<video src={this.state.downloadUrl} controls={true}></video>)

            downLinkAudio = (<div>
                <a href={this.state.downloadUrl} download="dmkmdvkmdkm">Download</a>
            </div>)
        }
        if( !this.props.isSceenSharing && 
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            this.state.timeOutNoAnswer) {
                var shareTimeElements = (<div className="clickedMessage">
                    <audio  style={{display:"none"}}autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                    <p><b>Link expired</b></p>
                    <p>Client did not click to get connected</p>
                </div>)
            }
       

        if (this.state.shareScreenLink && 
            !this.props.isSceenSharing  && 
            !this.state.clickedOnLink &&
            !this.props.isSharingCompleted &&
            !this.state.timeOutNoAnswer) {
            //    alert(this.state.sharablelink)
            linkElement = (
                <div>
                    <p>Share the link below to get connected </p>
                    <p>The link expires in 3 minutes</p>
                    <p>You will be notified with a sound when peer clicks on the link</p>
                    <CopyToClipboard sharablelink={this.state.shareScreenLink} />
                    {/* <input className="myInput" type="text" value={this.state.shareScreenLink} id="myInput"/>
                <span class="hint--bottom" aria-label={this.state.copyStatus}>
                    <button className="buttonDark" onClick={this.copyToClipboard}>
                    Copy text
                    </button>
                </span> */}

                </div>)
        }
        return (
            <div>

                <div>

                    {/* {Circle} */}
                </div>
                <div className="Btns">

                </div>
                <div className="LinkDisplay">
                    {linkElement}
                    {shareTimeElements}
                    {postShareElements}
                    <audio id="video" ref={a => this.videoTag = a} srcObject=" " ></audio>
                    {/* {downLinkAudio} */}
                </div>
            </div>
        )
    }
}
ScreenRecorder.PropType = {
    StartedSharing: PropType.func.isRequired,
    stopedSharing: PropType.func.isRequired,
    saveVideoBlob: PropType.func.isRequired
}
const mapStateToProps = state => ({
    isSharingCompleted: state.tools.isSharingCompleted,
    isSceenSharing: state.tools.isScreenSharing,
    isSaved: state.issues.successCreation,
    sharablelink: state.issues.sharablelink
})

export default connect(mapStateToProps, { StartedSharing, stopedSharing, saveVideoBlob })(ScreenRecorder)
