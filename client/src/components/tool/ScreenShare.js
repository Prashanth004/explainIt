import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc'
import Dummy from './dummy'
import html2canvas from 'html2canvas'
import config from '../../config/config'
import '../css/shareScreen.css'
import {StartedSharing,
    stopedSharing,
    saveVideoBlob} from '../../actions/toolActions'
import {connect} from 'react-redux';
import PropType from  'prop-types'; 
import Swal from 'sweetalert2'


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

        }
        this.renderer = this.renderer.bind(this);
        this.stopShare = this.stopShare.bind(this);
        // this.stopScreenShare = this.stopScreenShare.bind(this);
        this.startScreenShareSend = this.startScreenShareSend.bind(this);
        this.generateLink = this.generateLink.bind(this);
        this.savefile = this.savefile.bind(this)
        // this.recordScreenStop = this.recordScreenStop.bind(this);
    }


      startScreenShareSend() {
        var self = this
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (audioStream) {
            var finalStream = new MediaStream();
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
                finalStream: finalStream
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
            }
        }).catch(err => {
            console.log("error ouucres : ", err)
        })
    }

    componentWillMount() {
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
                conn.on('data', (data) => {
                    this.props.StartedSharing()
                    console.log("data : ", data)
                 
                    self.setState({
                        destkey: data.clientId,
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
        this.props.stopedSharing();
        var self = this;
        var recorder1 = this.state.recorder;
        var audioStream = this.state.audioStream;
        var canvasStream = this.state.canvasStream;
        audioStream.stop();
        canvasStream.stop();
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
        })
    }

    render() {
       
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
                    <div onClick ={this.stopShare}id="inner-circle">END</div>
                </div>
            </div>
        )
        }
            if(this.props.isSharingCompleted){
           var postShareElements= (<div>
                <p>Do you want to post the call to help other?</p>
                <button onClick={this.savefile} className="buttonLight save">
                  Save
                </button>
                <button onClick={this.discard}className="buttonDark save">
                    Discard
                </button>
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
                <div className="sharableLink">
                    <p>Please share the link to connect</p>
                    <div className = "linkOuter">
                    <div className="link">
                        <p>{this.state.shareScreenLink}</p>
                    </div>
                    <div className="button">
                        <button className="cpyBtn">Copy</button>
                    </div>
                    </div>
            </div>
        )
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
    isSceenSharing : state.tools.isScreenSharing
}) 

export default connect(mapStateToProps,{StartedSharing,stopedSharing,saveVideoBlob})(ScreenRecorder)
