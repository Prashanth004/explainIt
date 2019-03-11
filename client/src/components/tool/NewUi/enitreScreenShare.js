import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc'
import Dummy from './dummy'
import config from '../../../config/config'
import '../../css/shareScreen.css'
import CopyToClipboard from '../CopytoClipboard';
import socketIOClient from "socket.io-client";
import {fullStartedSharing,
    fullStopedSharing,
    saveVideoBlob} from '../../../actions/toolActions'
import {connect} from 'react-redux';
import PropType from  'prop-types'; 
import browser from 'browser-detect';

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
            socket:null,
            peer: null,
            peerId: null,
            connected: false,
            shareScreenLink:null,
            copyStatus:"copy link",
            sourceId:null,
            screenStream:null,
            call:null,
            closedHere:false,
            showDisconectMessage:false,
            timerEnded: false,
            answered:false,
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
        console.log("sourceId  : ", sourceId)
        const result = browser();
        if(result.name === "chrome"){
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
        else if(result.name ==="firefox"){
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
        this.stopShare()

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
        const socket = socketIOClient(config.base_dir);
        this.setState({
            socket:socket
        })
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
                    answered:true
                })
                conn.on('data', (data) => {
                    this.props.fullStartedSharing()
                    console.log("data : ", data)
                 
                    self.setState({
                        destkey: data.clientId,
                        answered:false  
                    })
                    const result = browser();
                    if(result.name === "chrome"){
                        self.receiveMessage()
                    }
                    else if(result.name ==="firefox"){
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
            this.setState({
                timerEnded:true
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
        var socket = this.state.socket
        console.log("socket : ",socket)
  
             socket.emit(config.LINK_TO_CALL,{
                 'link':shareScreenLink,
                 'fromEmail' : this.props.email,
                 'fromUserName' : this.props.userName,
                 'fromProfilePic':this.props.profilePic,
                 'fromUserId':this.props.id,
                 'ToUserId':this.props.peerUserId
             })
    }

    savefile(){
        this.props.savefile(this.state.blob)
    }

    stopShare() {
        if(!this.state.closedHere && !this.state.timerEnded){
            this.setState({
                showDisconectMessage:true
            })
        }
        this.props.fullStopedSharing();
        var self = this;
        var recorder1 = this.state.recorder;
        var audioStream = this.state.audioStream;
        var  screenStream=this.state.screenStream;
        if(audioStream!==null){
            audioStream.stop();
        }
       if(screenStream!==null){
        screenStream.stop();
       }
      
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
        if(this.state.timerEnded){
            var MessageDisconnected=(<p><b>Dissconected as the call exceded 3 mins</b></p>)
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
    }
        else if(this.state.answered && !this.props.isSceenSharing){
            shareTimeElements=(<div>
                <p>Call answered</p>
                <p>Connecting ....</p>
            </div>)
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
             </div>)
        }
        if (this.state.downloadUrl) {
            videoplayer = (<video src={this.state.downloadUrl} controls={true}></video>)

            downLinkAudio = (<div>
                <a href={this.state.downloadUrl} download="dmkmdvkmdkm">Download</a>
            </div>)
        }
       
        if (this.state.shareScreenLink && !this.state.answered  && (this.props.isSceenSharing!==true) && (this.props.isSharingCompleted!== true)) {
            linkElement = (<div>

                <p>Waiting for the other peer to connect..</p>
            </div>)
        }
        return (
              
                <div className="LinkDisplay">
                    {linkElement}
                    {shareTimeElements}
                    {postShareElements}
                    <audio id="video"  ref={a => this.videoTag=a} srcObject=" " ></audio>
                </div>
           
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
    userName:state.auth.userName,
    id:state.auth.id,
    email:state.auth.email,
    profilePic:state.auth.profilePic,
    peerUserId:state.visitProfile.id
}) 

export default connect(mapStateToProps,{fullStartedSharing,fullStopedSharing,saveVideoBlob})(ScreenRecorder)
