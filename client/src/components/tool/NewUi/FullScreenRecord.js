import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc';
import CopyToClipboard from '../CopytoClipboard';
import {setStream} from '../../../actions/streamActions'
import { saveSourceId } from "../../../actions/extensionAction";
import Dummy from './dummy'
import {fullStartedRecording,
    fullStopedRecording,discardAfterRecord} from'../../../actions/toolActions'
import {connect} from 'react-redux';
import PropType from  'prop-types'; 

class FullScreenRecorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recorder: null,
            downloadUrl:null,
            audioStream: null,
            screenStream: null,
            blob: null,
            finalStream: null,
            percentage:"0%",
            copyStatus:"copy link",
            saveBtnClicked:false
           
            
        }
        this.recordScreenStop = this.recordScreenStop.bind(this);
        this.renderer = this.renderer.bind(this);
        this.startBar =  this.startBar.bind(this);
        this.startRecoding = this.startRecoding.bind(this);
        this.toggle = this.toggle.bind(this);
        this.savefile = this.savefile.bind(this);
        this.discardChanges = this.discardChanges.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);


    }

    startRecoding(){
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

        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (audioStream) {
            navigator.mediaDevices.getUserMedia(constraints).then(function (screenStream) {
            var finalStream = new MediaStream();
            window.getTracks(audioStream, 'audio').forEach(function (track) {
                finalStream.addTrack(track);
            });
           
            window.getTracks(screenStream, 'video').forEach(function (track) {
                finalStream.addTrack(track);
            });
            var recorder1 = RecordRTC(finalStream, {
                type: 'video'
            });
            self.props.setStream(audioStream,screenStream,finalStream)

            recorder1.startRecording();

            self.setState({
                recorder:recorder1,
                audioStream: audioStream,
                screenStream: screenStream,
                finalStream: finalStream,

            })
            self.props.startDraw()

           
        }).catch(err =>{
            console.log(" error : ",err)
        })
           
        }).catch(err => {
            console.log("error ouucres : ", err)
        })
    }
    componentDidMount(){
    var self = this
        function postMessageHandler(event) {
            console.log(" event :", event)
            if (event.data.sourceId !== undefined) {
                console.log("We've got a message!");
                console.log("* Message:", event.data);
                console.log("* Origin:", event.origin);
                console.log("* Source:", event.source);
                console.log("*event.data.message__sourceId : ", event.data.sourceId)
                self.props.saveSourceId(event.data.sourceId)
                self.startRecoding()
            }

        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }
    }
    copyToClipboard(){
        var copyText = document.querySelector('.myInput');
        copyText.select();
        document.execCommand("copy");
        this.setState({
            copyStatus:"link copied"
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
        // this.props.clearCanvas();
        // this.props.discardAfterRecord();

       window.location.reload();

    }
    receiveMessage() {
        
        console.log("i reached insoide start Recording")
        var mainBtn = document.querySelector('.mainBtn');
        mainBtn.style.backgroundColor="rgb(133, 39, 39)";
        this.convey.innerText="Stop"
        var source = this.props.extSource
        var origin = this.props.extOrigin
        if (this.props.extSource!==null) {
            source.postMessage('audio-plus-tab', origin);
        }
    }

    toggle(){
        console.log("this.props.isFullScreenRecording : ",this.props.isFullScreenRecording)
        if(this.props.isFullScreenRecording){
            this.recordScreenStop()
        }
        else{
            
            this.receiveMessage()
            this.startRecoding()
            this.props.fullStartedRecording();
        }
    }
    savefile(){
    this.props.savefile(this.state.blob)
    this.setState({
        saveBtnClicked: true
    })

}
    recordScreenStop() {
        var self = this;
        var recorder1 = this.state.recorder;
        // var audioStream = this.state.audioStream;
        // var screenStream = this.state.screenStream;
        var audioStream = this.props.audioStream;
        var  screenStream=this.props.screenStream;
        console.log("recording : ",recorder1)
        if (recorder1) {
            recorder1.stopRecording(function () {
                var blob = recorder1.getBlob();
                self.setState({
                    downloadUrl: URL.createObjectURL(blob),
                    blob: blob
                })

                audioStream.stop();
                screenStream.stop();
                self.props.fullStopedRecording()
            });
        }
      
        this.setState({
            recorder: null,
            audioStream: null,
            screenStream: null,
        })
    }

    render() {
        var ua = window.detect.parse(navigator.userAgent);
    //     if(ua.browser.family === "Chrome"){
    //     if(this.props.sourceId!==null){
    //         console.log("render source id calling function : ",this.props.sourceId)
    //         this.startRecoding()
    //     }
    // }
        if (this.props.isFullScreenRecording) {
            this.startBar()
            var timer = (<Countdown
                date={Date.now() + 180000}
                renderer={this.renderer}
            />)
            var recordingEle = ( <p>Recording screen</p>)
        }
        var videoplayer = " ";
        var downLinkAudio = " ";
        var linkElement = " ";
        var convey = (<p ref={a=>this.convey=a}>Start</p>)
       
        if (this.state.downloadUrl) {
            videoplayer = (<video className="videoPlayer2" src={this.state.downloadUrl} controls={true}></video>)
           
        }
     

     
        if(this.props.isFullRecordCompleted ===false){
        var recordingElements = (<div>
            <div className="progresDiv">
                 <div  className="progress" id="pbar" ></div>
             </div>
             {timer}
             {recordingEle}
            
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
     
        if(this.props.isFullRecordCompleted === true && !this.state.saveBtnClicked && this.props.isSaved===false){
            var postShareElements= (<div className = "postRecord">
            <div classNam="showVideoElement">
            {videoplayer}
            </div>
       
                 <p>Do you want to sav it?</p>
                 <button onClick={this.savefile} className="buttonLight save">
                   Save
                 </button>
                 <button onClick={this.discardChanges} className="buttonDark save">
                     Discard
                 </button>
             </div>)
         }
         else if(this.props.isSaved ){
            // elseif {
            var postShareElements= (<div className = "postRecord">
            
                 <p>Link to access your saved project</p>
                 <CopyToClipboard sharablelink = {this.props.sharablelink} />

                 {/* <input className="myInput" type="text" value={this.props.sharablelink}/>
                <span class="hint--bottom" aria-label={this.state.copyStatus}>
                    <button className="buttonDark" id="afterSave" onClick={this.copyToClipboard}>
                    Copy text
                    </button>
                </span> */}
             </div>)

         }
         else if(this.state.saveBtnClicked && !this.props.isSaved){
            var postShareElements= (<div>
                 <p>Save processing..</p>
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
FullScreenRecorder.PropType={
    fullStartedRecording : PropType.func.isRequired,
    fullStopedRecording :PropType.func.isRequired,
    discardAfterRecord :PropType.func.isRequired,
    saveSourceId:PropType.func.isRequired,
    setStream: PropType.func.isRequired,
}
const mapStateToProps = state =>({
    isFullScreenRecording :state.tools.isFullScreenRecording,
    isFullRecordCompleted : state.tools.isFullRecordCompleted,
    isSaved :state.issues.successCreation,
    sharablelink : state.issues.sharablelink,
    extSource:state.extension.source,
    extOrigin:state.extension.origin,
    extSourceId:state.extension.sourceId,
    audioStream :state.stream.audioStream,
    screenStream : state.stream.screenStream,
}) 

export default connect(mapStateToProps,{saveSourceId,fullStartedRecording, setStream,discardAfterRecord, fullStopedRecording})(FullScreenRecorder)

