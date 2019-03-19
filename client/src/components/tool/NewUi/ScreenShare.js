import React, { Component } from 'react'
import RecordRTC from 'recordrtc'
import Dummy from './dummy'
import CopyToClipboard from '../CopytoClipboard';
import config from '../../../config/config'
import '../../css/shareScreen.css';
import socketIOClient from "socket.io-client";
import { restAllToolValue } from "../../../actions/toolActions";
import { displayScrenRecord} from '../../../actions/toolActions';
import { getRecpientId, resetValues } from '../../../actions/twitterApiAction';


import {
    StartedSharing,
    stopedSharing,
    saveVideoBlob
} from '../../../actions/toolActions'
import { connect } from 'react-redux';
import PropType from 'prop-types';
class ScreenRecorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recorder: null,
            audioStream: null,
            canvasStream: null,
            downloadUrl: null,
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
            timeOutNoAnswer:false,
            retryLimit:0,
            retry:false,
            retryTimeOut:false,
            noInternet:false,
            twitterHandle: null,
            tweetTested: false,
        }
        this.renderer = this.renderer.bind(this);
        this.stopShare = this.stopShare.bind(this);
        this.startScreenShareSend = this.startScreenShareSend.bind(this);
        this.generateLink = this.generateLink.bind(this);
        this.savefile = this.savefile.bind(this)
        this.endCall = this.endCall.bind(this);
        this.retryCall = this.retryCall.bind(this);
        this.recordCall = this.recordCall.bind(this);
        this.testHandle = this.testHandle.bind(this);
        this.updateTwitterHandleBox = this.updateTwitterHandleBox.bind(this)

    }

    retryCall(){
        var socket = this.state.socket;
        var self = this
        this.setState({
            retry:true,
            retryLimit:this.state.retryLimit+1,
           
                initiatedCloseCall : false
          
        })
        socket.emit(config.RETRYCALL,{
            "peerId" : self.state.peerId
        })
        
        setTimeout(()=>{
            if(self.state.retry && !self.state.clickedOnLink){
                alert("not connected")
                self.setState({
                    retryTimeOut:true
                })
            }
        },10000)
        if (!navigator.onLine) {
            console.log("no intenet")
            self.setState({
                noInternet: true
            })
        }
    }
    recordCall(){
       
        this.props.restAllToolValue();
        this.props.displayScrenRecord()
       

    }

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
                call: call,
                retry:false
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
                if (peer !== null) {
                    peer.destroy()
                    this.setState({
                        peerId : null,
                        peer:null,
                        manualClose: true
                    })
                }
            }
           
        })
        socket.on(config.CHECK_TOKEN_VALIDITY, data=>{

            console.log("confmessage : ", data)
            console.log(" ")
                if(data.clientId === self.state.peerId){
                socket.emit(config.COMFIRM_TOKEN_VALIDITY,{
                    success: 1,
                    msg:"token valid"
                })
            }
        })

        
    }
    componentWillUnmount() {

        this.stopShare()

    }
   
    endCall() {
        var socket = this.state.socket
        var peer = this.state.peer
        this.setState({
            closedHere: true,
            manualClose: true
        })
        socket.emit(config.END_CALL, {
            'peerId': this.state.peerId
        })
        this.stopShare()
        if (peer !== null) {
            peer.destroy()
            this.setState({
                peerId : null,
                peer:null
            })
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
            isAudioRecDone: true,
            isRecording: "",
            recorder: null,
            audioStream: null,
            canvasStream: null,
            clickedOnLink:false
        })
       
    }

    render() {
        var noInternet = null
        var validatinginfo = null
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
        var timer = null;
        if (this.state.timerEnded) {
            var MessageAbtDisConect = (<p><b>Dissconected as the call exceded 3 mins</b></p>)
        }
        if (this.state.showDisconectMessage && !this.state.closedHere && this.state.manualClose) {
            var MessageAbtDisConect = (<p><b>Dissconected from other peer</b></p>)
        }
        else if(!this.state.manualClose && !this.state.retry && (this.state.retryLimit<1)){
            var MessageAbtDisConect =(
                <div>
            <p><b>Call ended due to network issues</b></p>
            <button className="buttonDark"  onClick={this.retryCall}>Retry</button>
            <button className="buttonDark "onClick={this.recordCall}>Record</button>
            <button className="buttonDark" onClick={this.props.reStoreDefault}>Cancel</button>
            </div>
            )
        }
        else if(!this.state.manualClose && !this.state.retry){
            var MessageAbtDisConect =(
                <div>
            <p><b>Call ended due to network issues</b></p>
            <p>You can reord the canvas and send it</p>
            <button className="buttonDark" onClick={this.recordCall}>Record</button>
            <button className="buttonDark"onClick={this.props.reStoreDefault}>Cancel</button>
            </div>
            )
        }
        else if (this.state.retry && !this.state.retryTimeOut && !this.state.noInternet) {
            var MessageAbtDisConect =(
                <div>
            <p><b>Reconnecting..</b></p>
            
            </div>
            )
        }
        else if (this.state.retry && (this.state.retryTimeOut || this.state.noInternet)) {
            var MessageAbtDisConect =(
                <div>
            <p><b>Retry failed</b><br />{noInternet}</p>
            <p>You can reord the canvas and send it</p>
            <button className="buttonDark" onClick={this.recordCall}>Record</button>
            <button className="buttonDark"onClick={this.props.reStoreDefault}>Cancel</button>
            </div>
            )
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
            if(this.state.retryLimit === 0 ){
                var shareTimeElements = (<div className="clickedMessage">
                <audio  style={{display:"none"}}autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                <p><b>Link clikced</b></p>
                <p>Connecting.. </p>
            </div>)
            }
            else{
                var shareTimeElements = (<div className="clickedMessage">
                <audio  style={{display:"none"}}autoPlay src={require('../../audio/brute-force.mp3')}></audio>
                <p>Connecting.. </p>
            </div>)
            }
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
    saveVideoBlob: PropType.func.isRequired,
    restAllToolValue: PropType.func.isRequired,
    displayScrenRecord: PropType.func.isRequired,
    getRecpientId: PropType.func.isRequired,
    resetValues: PropType.func.isRequired
}
const mapStateToProps = state => ({
    isSharingCompleted: state.tools.isSharingCompleted,
    isSceenSharing: state.tools.isScreenSharing,
    isSaved: state.issues.successCreation,
    sharablelink: state.issues.sharablelink,
    twitterHandleValid: state.twitterApi.profilePresent,
    doneFetching: state.twitterApi.doneFetching


})

export default connect(mapStateToProps, {getRecpientId,resetValues, displayScrenRecord, restAllToolValue,StartedSharing, stopedSharing, saveVideoBlob })(ScreenRecorder)
