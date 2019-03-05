import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc'
import Dummy from '../dummy'
import html2canvas from 'html2canvas'
import config from '../../../config/config'
import '../../css/shareScreen.css'
import CopyToClipboard from '../CopytoClipboard';

import {fullStartedSharing,
    fullStopedSharing,
    saveVideoBlob} from '../../../actions/toolActions'
import {connect} from 'react-redux';
import PropType from  'prop-types'; 
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
            streamvideo: null,
            peer: null,
            peerId: null,
            connected: false,
            shareScreenLink:null,
            copyStatus:"copy link",
            sourceId:null,
            screenStream:null,
            call:null,
            closedHere:false,
            showDisconectMessage:false
        }
        this.renderer = this.renderer.bind(this);
        this.stopShare = this.stopShare.bind(this);
        this.startScreenShareSend = this.startScreenShareSend.bind(this);
        this.generateLink = this.generateLink.bind(this);
        this.savefile = this.savefile.bind(this)
        // this.copyToClipboard = this.copyToClipboard.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.endCall = this.endCall.bind(this)
    }

      startScreenShareSend() {
        var self = this
        var sourceId = this.props.extSourceId;
        var ua = window.detect.parse(navigator.userAgent);

        if(ua.browser.family === "Chrome"){
            var constraints = { 
            video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  maxWidth: 2020,
                  maxHeight: 600,
                  maxFrameRate: 100,
                  minAspectRatio:1.75,
                  chromeMediaSourceId: sourceId         
                }
            }};
        }
        else if(ua.browser.family ==="Firefox"){
            var constraints = {
                video: {
                    mediaSource: "screen", 
                    width: {max: '1920'},
                    height: {max: '1080'},
                    frameRate: {max: '10'}
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
                var peer = self.state.peer
                var call = peer.call(self.state.destkey, finalStream);
                var recorder1 = RecordRTC(finalStream, {
                    type: 'video'
                });
                recorder1.startRecording();
                self.setState({
                    recorder:recorder1,
                    audioStream: audioStream,
                    screenStream:screenStream,
                    finalStream: finalStream,
                    call:call
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
                    call.on('close',function(){
                        self.stopShare()
                    })
                }
            }).catch(err => {
                console.log("error ouucres : ", err)
            })
    });
    }
    endCall(){
        var call = this.state.call;
        this.setState({
            closedHere:true
        })
        setTimeout(()=>{
            call.close();
        },400);
        
    }
    receiveMessage() {
        var source = this.props.extSource
        var origin = this.props.extOrigin
        if (this.props.extSource!==null) {
            source.postMessage('audio-plus-tab', origin);
        }
    }

    componentWillMount() {
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
                conn.on('data', (data) => {
                    this.props.fullStartedSharing()
                    console.log("data : ", data)
                 
                    self.setState({
                        destkey: data.clientId,
                    })
                    var ua = window.detect.parse(navigator.userAgent);
                    if(ua.browser.family === "Chrome"){
                        self.receiveMessage()
                    }
                    else if(ua.browser.family ==="Firefox"){
                        self.startScreenShareSend()
                    }
            
                });
            });
        });
        this.setState({
            peer: peer
        })
    }
    discard = ()=>{
        setTimeout(()=>{
            window.close()
          },1000);
    }

    renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
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

    savefile(){
        this.props.savefile(this.state.blob)
    }

    stopShare() {
        if(!this.state.closedHere){
            this.setState({
                showDisconectMessage:true
            })
        }
        this.props.fullStopedSharing();
        var self = this;
        var recorder1 = this.state.recorder;
        var audioStream = this.state.audioStream;
        var  screenStream=this.state.screenStream;
        audioStream.stop();
        screenStream.stop();
        var audio = document.querySelector('#video');
        audio.src = "";
        console.log("recorder1 : ",recorder1)
        if (recorder1) {
            recorder1.stopRecording(function () {
                console.log("recorder 1 : ", recorder1)
                var blob = recorder1.getBlob();
                console.log("blob : ",blob)
                self.setState({
                    downloadUrl: URL.createObjectURL(blob),
                    blob: blob
                })
                self.props.saveVideoBlob(blob)
            });
        }
        else {
            // Swal.fire(
               
            //     'error occured while recodimg'
               
            //   )
        }
        this.setState({
            isShareDone:true,
            isAudioRecDone: true,
            isRecording: "",
            recorder: null,
            audioStream: null,
            canvasStream: null,
              call:null,
          
        })
    }

    render() {
        if(this.props.extSourceId!==null){
            console.log("render source id calling function : ",this.props.sourceId)
            this.startScreenShareSend()
        }
        if(this.state.showDisconectMessage){
            var MessageDisconnected = (<p><b>Disconnected from other peer</b></p>)
        }
        else{
            var MessageDisconnected = null
        }
        var timer = null;
        var videoplayer = " ";
        var downLinkAudio = " ";
        var linkElement = " ";
        if(this.props.isSceenSharing){
            timer = (<Countdown
                date={Date.now() + 180000}
                renderer={this.renderer}
            />)
            var shareTimeElements = (
            <div>
                  {timer}
                <button className="Rec"></button>
                <div id="main-circle">
                    <div onClick ={this.endCall}id="inner-circle">END</div>
                </div>
            </div>
        )
        // this.receiveMessage()
        }
            if(this.props.isSharingCompleted  && this.props.isSaved==false){
           var postShareElements= (<div>
               {MessageDisconnected}
                <p>Do you want to post the call to help other?</p>
                <button onClick={this.savefile} className="buttonLight save">
                  Save
                </button>
                <button onClick={this.discard}className="buttonDark save">
                    Discard
                </button>
            </div>)
        }
        else if(this.props.isSaved){
            var postShareElements= (<div className = "postRecord">
            
                 <p>Link to access your saved project</p>
                 <CopyToClipboard sharablelink = {this.props.sharablelink} />

                 {/* <input id="savedLink" className="myInput" type="text" value={this.props.sharablelink}/>
                <span class="hint--bottom" aria-label={this.state.copyStatus}>
                    <button className="buttonDark" id="afterSave" onClick={this.copyToClipboard}>
                    Copy text
                    </button>
                </span> */}
             </div>)
        }
        if (this.state.downloadUrl) {
            videoplayer = (<video src={this.state.downloadUrl} controls={true}></video>)

            downLinkAudio = (<div>
                <a href={this.state.downloadUrl} download="dmkmdvkmdkm">Download</a>
            </div>)
        }
       
        if (this.state.shareScreenLink && (this.props.isSceenSharing!==true) && (this.props.isSharingCompleted!== true)) {
            linkElement = (
                <div>
                    <p>Share the link below to get connected</p>
                    <CopyToClipboard sharablelink = {this.state.shareScreenLink} />

                {/* <input className="myInput" type="text" value={this.state.shareScreenLink} id="myInput"/>
                <span class="hint--bottom" aria-label={this.state.copyStatus}>
                    <button className="buttonDark" onClick={this.copyToClipboard}>
                    Copy text
                    </button>
                </span> */}
             
    </div>)
        }
        return (
            // <div>
              
                <div className="LinkDisplay">
                    {linkElement}
                    {shareTimeElements}
                    {postShareElements}
                    <audio id="video"  ref={a => this.videoTag=a} srcObject=" " ></audio>
                    {/* {downLinkAudio} */}
                </div>
            // </div>
        )
    }
}
ScreenRecorder.PropType={
    StartedSharing: PropType.func.isRequired, 
    stopedSharing: PropType.func.isRequired,
    saveVideoBlob: PropType.func.isRequired
}
const mapStateToProps = state =>({
    isSharingCompleted : state.tools.isFullSharingCompleted,
    isSceenSharing : state.tools.isFullScreenSharing,
    isSaved :state.issues.successCreation,
    sharablelink : state.issues.sharablelink,
    extSource:state.extension.source,
    extOrigin:state.extension.origin,
    extSourceId:state.extension.sourceId,
}) 

export default connect(mapStateToProps,{fullStartedSharing,fullStopedSharing,saveVideoBlob})(ScreenRecorder)
