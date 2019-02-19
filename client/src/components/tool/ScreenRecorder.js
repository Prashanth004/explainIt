import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc'
import Dummy from './dummy'
import {StartedRecording,
    stopedRcording,discardAfterRecord} from'../../actions/toolActions'
import {connect} from 'react-redux';
import PropType from  'prop-types'; 


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
            percentage:"0%"
        }
        this.recordScreenStop = this.recordScreenStop.bind(this);
        this.renderer = this.renderer.bind(this);
        this.startBar =  this.startBar.bind(this);
        this.startRecoding = this.startRecoding.bind(this);
        this.toggle = this.toggle.bind(this);
        this.savefile = this.savefile.bind(this);
        this.discardChanges = this.discardChanges.bind(this)

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
            console.log("......")
            progressbar.style.width=width+'%';
                  }
        }   
    }

    renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
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
        else {
            alert("Some thign went wrong")
        }
        this.setState({
            recorder: null,
            audioStream: null,
            canvasStream: null,
        })
    }

    render() {
        var videoplayer = " ";
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
    
       
        // var timer = null;
     
        if(this.props.isRecordingCompleted === true){
            var postShareElements= (<div className = "postRecord">
            {videoplayer}
                 <p>Do you want to sav it?</p>
                 <button onClick={this.savefile} className="buttonLight save">
                   Save
                 </button>
                 <button onClick={this.discardChanges} className="buttonDark save">
                     Discard
                 </button>
             </div>)
         }
       
        if (this.state.shareScreenLink) {
            linkElement = (<p>{this.state.shareScreenLink}</p>)
        }
        return (
            <div>
               {recordingElements}
                {postShareElements}
          

                {/* <div class="container">
  <div class="progress" id="progress"></div>
  <audio id="audio" src="https://www.freesound.org/data/previews/338/338825_1648170-lq.mp3"></audio>
  <button class="togglePlay" onClick="togglePlay()">Play/Pause</button>
</div> */}





                {/* <div>
                    {timer}
                </div>
                <div className="Btns">
                    <button className="buttonLight btnss" disabled={this.state.stopBtn} onClick={this.recordScreenStop}>
                        Stop
          </button>
                    <button className="buttonLight btnss" disabled={this.state.startBtn} onClick={this.recordScreenStart}>
                        Start
          </button>
                    <input type="text" onChange={this.handle_dest} />
                    <button className="buttonLight btnss" disabled={this.state.startBtn} onClick={this.generateLink}>
                        shareScreenLink
          </button>
                    <button className="buttonLight btnss" disabled={this.state.startBtn} onClick={this.startScreenShareSend}>
                        Send
          </button>
                </div>
                <div className="videoPlayer">
                    {linkElement}
                    {videoplayer}
                    <audio id="video" controls={true} ref={a => this.videoTag} srcObject=" " ></audio>
                    {/* {downLinkAudio} 
                    </div>
                    */}
            
            </div>
        )
    }
}
ScreenRecorder.PropType={
    StartedRecording : PropType.func.isRequired,
    stopedRcording :PropType.func.isRequired,
    discardAfterRecord :PropType.func.isRequired,
    
}
const mapStateToProps = state =>({
    isScreenRecording :state.tools.isScreenRecording,
    isRecordingCompleted : state.tools.isRecordingCompleted
}) 

export default connect(mapStateToProps,{StartedRecording,discardAfterRecord, stopedRcording})(ScreenRecorder)

