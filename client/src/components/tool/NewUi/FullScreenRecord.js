import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc';
import CopyToClipboard from '../CopytoClipboard';
import {setStream} from '../../../actions/streamActions'
import { saveSourceId } from "../../../actions/extensionAction";
import Dummy from './dummy';
import Form from '../Form'
import {showCanvas, hideCanvas} from '../../../actions/canvasAction'
import { Button } from 'reactstrap';
import { FiSave, FiX, FiTwitter, FiVideo } from "react-icons/fi";
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
            saveBtnClicked:false,
            showCanvas:false
           
            
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
        this.toggleCanvas = this.toggleCanvas.bind(this)

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
            self.startBar()
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
        var id = setInterval(frame,1000);
        function frame() {
          if (width >= 100) {
            clearInterval(id);
          } else {
            width= width+(100/180); 
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
toggleCanvas(){
    if(this.state.showCanvas)
        this.props.hideCanvas()
    else this.props.showCanvas()
    this.setState({
        showCanvas:!this.state.showCanvas
    })
    
}
    recordScreenStop() {
        var self = this;
        var recorder1 = this.state.recorder;
       
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
                // 
            });
        }
         var audioStream = this.state.audioStream;
        var screenStream = this.state.screenStream;
        audioStream.stop();
        screenStream.stop();
        self.props.fullStopedRecording()
      
        this.setState({
            recorder: null,
            audioStream: null,
            screenStream: null,
        })
    }
    componentWillUnmount(){
        var audioStream = this.state.audioStream;
        var screenStream = this.state.screenStream;
        if(audioStream!==null && screenStream!== null)
        {
            audioStream.stop();
            screenStream.stop();
        }
       
    }

    render() {
        if (this.props.isFullScreenRecording) {
           
            var timer = (<Countdown
                date={Date.now() + 180000}
                renderer={this.renderer}
            />)
            var recordingEle = ( <div >
                <p>Recording screen</p>
                </div>)
        }
        else{
            var recordingEle = ( <div >
                <p>Record the screen and share</p>
            
                </div>)
        }
        var showCanv = (this.state.showCanvas)?(
            <div className="canvToolDivCall">
            <Form onRef={ref => (this.child = ref)} />
            <p>recording screen..</p>
            </div>
        ):(   <div className="recorderInfo">
        {recordingEle}
        </div>)
        var ua = window.detect.parse(navigator.userAgent);
    //     if(ua.browser.family === "Chrome"){
    //     if(this.props.sourceId!==null){
    //         console.log("render source id calling function : ",this.props.sourceId)
    //         this.startRecoding()
    //     }
    // }
     
        var videoplayer = " ";
        var downLinkAudio = " ";
        var linkElement = " ";
        var convey ="Start"
       
        if (this.state.downloadUrl) {
            videoplayer = (<video className="videoPlayer2" src={this.state.downloadUrl} controls={true}></video>)
           
        }
     

     
        if(this.props.isFullRecordCompleted ===false){
        var recordingElements = (<div>
             <div className="statusBarCall">
                <div className="timerDiv">
                </div>
                <div>

                </div>
                <div>
                    {/* <p onClick={this.toggleCanvas}>Canvas</p> */}
                </div>
                
            </div>
            {showCanv}
           
            <div className="recorderfooter">
                <div className="progresDiv">
                    <div  className="progress" id="pbar" ></div>
                </div>
                {timer}
                
                <div className="btDiv">
                        <button className="mainBtn" ref={a=>this.convey=a} onClick={this.toggle}>{convey}</button>
                </div>
                {/* <div className="convey">
                    {convey}
                </div> */}
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
                 <span className="hint--bottom" aria-label="Save Call">
                <FiSave className="icons" onClick={this.savefile} />
            </span>
            <span className="hint--bottom" aria-label="Cancel">
                <FiX className="icons" onClick={this.discardChanges} />
            </span>
                 {/* <button onClick={this.savefile} className="buttonLight save">
                   Save
                 </button>
                 <button onClick={this.discardChanges} className="buttonDark save">
                     Discard
                 </button> */}
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
            <div className="recordMainScreen">
             {/* <Button close onClick={this.props.reStoreDefault} /> */}
               {recordingElements}
                {postShareElements}
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
    showCanvas: PropType.func.isRequired, 
    hideCanvas: PropType.func.isRequired
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

export default connect(mapStateToProps,{saveSourceId, showCanvas, hideCanvas,fullStartedRecording, setStream,discardAfterRecord, fullStopedRecording})(FullScreenRecorder)

