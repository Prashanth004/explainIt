import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc'
import Dummy from './dummy'
import CopyToClipboard from '../CopytoClipboard';
import html2canvas from 'html2canvas'
import config from '../../../config/config';
import socketIOClient from "socket.io-client";
import '../../css/shareScreen.css'
import {StartedSharing,
    stopedSharing,
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
            call:null,
            closedHere:false,
            showDisconectMessage:false,
            timerEnded:false,
            socket:null,
            answered:false
        }
        this.renderer = this.renderer.bind(this);
        this.stopShare = this.stopShare.bind(this);
        this.startScreenShareSend = this.startScreenShareSend.bind(this);
        this.generateLink = this.generateLink.bind(this);
        this.savefile = this.savefile.bind(this)
        this.endCall = this.endCall.bind(this);
    }

      startScreenShareSend() {
        var self = this
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (audioStream) {
            var finalStream = new MediaStream();
            console.log("audio Stream : ",audioStream)
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
                recorder:recorder1,
                audioStream: audioStream,
                canvasStream: canvasStream,
                finalStream: finalStream,
                call :call
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
                call.on('close',function(){
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
            socket:socket
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
               
                console.log("got some data")
                this.setState({
                    answered:true
                })
               
                conn.on('data', (data) => {
                    this.props.StartedSharing()
                    console.log("data : ", data)
                    
                    self.setState({
                        destkey: data.clientId,
                        answered:false
                    })
                    self.startScreenShareSend()
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

    componentDidMount(){
       
    }


    renderer = ({ hours, minutes,seconds, secondcalls, completed }) => {
        if (completed) {
            // Render a completed state
            this.setState({
                timerEnded:true
            })
            var call = this.state.call;
            this.stopShare()
            setTimeout(()=>{
                call.close();
            },400)
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
    endCall(){
        var peer = this.state.peer;
        var call = this.state.call;
      
        this.setState({
            closedHere:true
        })
        
        setTimeout(()=>{
            call.close();
        },400)

        this.stopShare()
        
    }
    stopShare() {
        if(!this.state.closedHere && !this.state.timerEnded){
            console.log("I am here to show message")
            this.setState({
             showDisconectMessage:true 
            })
        }
        setTimeout(()=>{
            this.props.stopedSharing();
        },300)
       
        var self = this;
        var recorder1 = this.state.recorder;
        var audioStream = this.state.audioStream;
        var canvasStream = this.state.canvasStream;
        if((audioStream || audioStream!==null) && (canvasStream || canvasStream!== null)){
            audioStream.stop();
            canvasStream.stop();
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
        })
    }

    render() {
       
        var timer = null;
       if(this.state.showDisconectMessage){
        var MessageAbtDisConect=(<p><b>Dissconected from other peer</b></p>)
       }
       if(this.state.timerEnded){
           var MessageAbtDisConect=(<p><b>Dissconected as the call exceded 3 mins</b></p>)
       }
       else{
        var MessageAbtDisConect=(<p><b>Dissconected </b></p>)
       }
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
            if(this.props.isSharingCompleted && this.props.isSaved==false){
                this.savefile()
        }
        else if(this.props.isSaved){
            var postShareElements= (<div className = "postRecord">
            {MessageAbtDisConect}
                <p><b>The call has been successfuly saved in created list.</b></p>
                 <p>Link to access your saved project</p>
              </div>)
        }
        if (this.state.downloadUrl) {
            videoplayer = (<video src={this.state.downloadUrl} controls={true}></video>)

            downLinkAudio = (<div>
                <a href={this.state.downloadUrl} download="dmkmdvkmdkm">Download</a>
            </div>)
        }
       
        if (this.state.shareScreenLink && !this.state.answered && (this.props.isSceenSharing!==true) && (this.props.isSharingCompleted!== true)) {
    

            linkElement = (<div>

                <p>Waiting for the other peer to connect..</p>
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
                    <audio id="video"  ref={a => this.videoTag=a} srcObject=" " ></audio>
                    {/* {downLinkAudio} */}
                </div>
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
    isSharingCompleted : state.tools.isSharingCompleted,
    isSceenSharing : state.tools.isScreenSharing,
    isSaved :state.issues.successCreation,
    sharablelink : state.issues.sharablelink,
    userName:state.auth.userName,
    id:state.auth.id,
    email:state.auth.email,
    profilePic:state.auth.profilePic,
    peerUserId:state.visitProfile.id
}) 

export default connect(mapStateToProps,{StartedSharing,stopedSharing,saveVideoBlob})(ScreenRecorder)
