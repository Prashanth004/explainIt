import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc'
import Dummy from './dummy'
import {StartedRecording,
    stopedRcording,discardAfterRecord} from'../../../actions/toolActions'
import {connect} from 'react-redux';
import PropType from  'prop-types'; 
import CopyToClipboard from '../CopytoClipboard';
import '../../css/shareScreen.css';
import {sendMessage} from '../../../actions/messageAction'


export class ScreenRecorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recorder: null,
            downloadUrl:null,
            audioStream: null,
            canvasStream: null,
            blob: null,
            finalStream: null,
            percentage:"0%",
            copyStatus:"copy link"
        }
        this.recordScreenStop = this.recordScreenStop.bind(this);
        this.renderer = this.renderer.bind(this);
        this.startBar =  this.startBar.bind(this);
        this.startRecoding = this.startRecoding.bind(this);
        this.toggle = this.toggle.bind(this);
        this.savefile = this.savefile.bind(this);
        this.discardChanges = this.discardChanges.bind(this);
        this.sendMessageLocal = this.sendMessageLocal.bind(this)
    }

    startRecoding(){
        var self = this
        this.props.StartedRecording();
        var mainBtn = document.querySelector('.mainBtn');
        mainBtn.style.backgroundColor="rgb(133, 39, 39)";
        this.convey.innerText="Stop"
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
            self.props.startDraw()

           
          
           
        }).catch(err => {
            console.log("error ouucres : ", err)
        })
    }
    
    startBar(){
       var self = this;
        var progressbar = document.querySelector('#pbar');
        var progresDiv = document.querySelector(".progresDiv")
        progresDiv.style.display = "block";
        var width = 0;
        var id = setInterval(frame, 2000);
        function frame() {
          if (width >= 100) {
            clearInterval(id);
          } else {
            width= width+(100/90); 
            progressbar.style.width=width+'%';
                  }
        }   
    }

    renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            console.log("123445")
            this.recordScreenStop()
            return (<Dummy></Dummy>)

        } else {
            return <span>{hours}:{minutes}:{seconds}</span>;
        }
    };
    discardChanges(){
        this.props.clearCanvas();
        this.props.discardAfterRecord();

    }
    // copyToClipboard(){
    //     var copyText = document.querySelector('.myInput');
    //     copyText.select();
    //     document.execCommand("copy");
    //     this.setState({
    //         copyStatus:"link copied"
    //     })
    // }

    toggle(){
        if(this.props.isScreenRecording){
            this. recordScreenStop()
        }
        else{
            this.startRecoding()
        }
    }
    savefile(){
    this.props.savefile(this.state.blob)

}
sendMessageLocal(){
    var subject = "default subject"
    this.props.sendMessage(this.props.sharablelink,this.props.fromId,this.props.toId,subject)

}
    recordScreenStop() {
        var self = this;
        var recorder1 = this.state.recorder;
        var audioStream = this.state.audioStream;
        var canvasStream = this.state.canvasStream;
        console.log("recording : ",recorder1)
        if (recorder1) {
            recorder1.stopRecording(function () {
                var blob = recorder1.getBlob();
                self.setState({
                    downloadUrl: URL.createObjectURL(blob),
                    blob: blob
                })
                audioStream.stop();
                canvasStream.stop();
                self.props.stopedRcording()
            });
        }
       
        this.setState({
            recorder: null,
            audioStream: null,
            canvasStream: null,
        })
    }

    render() {
        var videoplayer = " ";
        var sentMessage = false
        var downLinkAudio = " ";
        var linkElement = " ";
        var convey = (<p ref={a=>this.convey=a}>Start</p>)
       
        if (this.state.downloadUrl) {
            videoplayer = (<video src={this.state.downloadUrl} controls={true}></video>)
           
        }
     

        if (this.props.isScreenRecording) {
            this.startBar()
            var timer = (<Countdown
                date={Date.now() + 180000}
                renderer={this.renderer}
            />)
        }
        if(this.props.isRecordingCompleted ===false){
        var recordingElements = (<div>
            <div className="progresDiv">
                 <div  className="progress" id="pbar" ></div>
             </div>
             {timer}
             <div className="btDiv">
                     <button className="mainBtn" onClick={this.toggle}></button>
             </div>
             <div className="convey">
                 {convey}
             </div>
             </div>
        )
    }
        else{
            var recordingElements = null;
        }

    if(this.props.isSaved && !this.props.sendSuccess){
        console.log("i a, here twoice?")
         if(!sentMessage){
            sentMessage=true
            this.sendMessageLocal() 
         }
          

    }
    
     console.log("this.props.isSaved : ",this.props.isSaved)
     console.log("this.props.sendSuccess : ", this.props.sendSuccess)
        if(this.props.isRecordingCompleted === true && this.props.isSaved==false){
            var postShareElements= (<div className = "postRecord">
            {videoplayer}
                 <p>Do you want to send it?</p>
                 <button onClick={this.savefile} className="buttonDark save">
                   Send
                 </button>
                 <button onClick={this.discardChanges} className="buttonLoght save">
                     Discard
                 </button>
             </div>)
         }
        
         else if(this.props.sendSuccess){
            var postShareElements= (<div className = "postRecord">
            <p><b>The recording successfully sent</b></p>
            <p>Link to access your saved project</p>
            <CopyToClipboard sharablelink = {this.props.sharablelink} />

        </div>)
         }
         else if(this.props.isSaved) {
             var postShareElements = (<div>
                 <p>Send the message. Please wait..</p>
                 </div>)
         }
       
        if (this.state.shareScreenLink) {
            linkElement = (<p>{this.state.shareScreenLink}</p>)
        }
        return (
            <div>
               {recordingElements}
                {postShareElements}
            </div>
        )
    }
}
ScreenRecorder.PropType={
    StartedRecording : PropType.func.isRequired,
    stopedRcording :PropType.func.isRequired,
    discardAfterRecord :PropType.func.isRequired,
    sendMessage:PropType.func.isRequired
}
const mapStateToProps = state =>({
    isScreenRecording :state.tools.isScreenRecording,
    isRecordingCompleted : state.tools.isRecordingCompleted,
    isSaved :state.issues.successCreation,
    newProject:state.issues.newissueItem,
    sharablelink : state.issues.sharablelink,
    fromId : state.auth.id,
    toId:state.visitProfile.id,
    sendSuccess:state.message.sendSuccess,
    
}) 

export default connect(mapStateToProps,{sendMessage,StartedRecording,discardAfterRecord, stopedRcording})(ScreenRecorder)

