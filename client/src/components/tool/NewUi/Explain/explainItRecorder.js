import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc';
import config from '../../../../config/config'
import {setStream} from '../../../../actions/streamActions'
import { saveSourceId } from "../../../../actions/extensionAction";
import Dummy from '../dummy';
import SaveElement from '../saveRecoding'
import Form from '../../Form'
import { cancelAllMessageAction } from '../../../../actions/messageAction'
import { restAllToolValue } from "../../../../actions/toolActions";
import {postStartCall} from '../../../../actions/extensionAction'

import {showCanvas, hideCanvas} from '../../../../actions/canvasAction'
import TimerBar from '../TimerBar'
import browser from 'browser-detect';
import {fullStartedRecording,
    fullStopedRecording,discardAfterRecord} from'../../../../actions/toolActions'
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
            showCanvas:false,
            isInstalled:true,
            permissonDenied:false
           
            
        }
        this.recordScreenStop = this.recordScreenStop.bind(this);
        this.savefilePrivate = this.savefilePrivate.bind(this);
        this.savefilePublic = this.savefilePublic.bind(this);
        this.renderer = this.renderer.bind(this);
        this.startBar =  this.startBar.bind(this);
        this.startRecoding = this.startRecoding.bind(this);
        this.toggle = this.toggle.bind(this);
        this.saveClicked = this.saveClicked.bind(this);
        this.discardChanges = this.discardChanges.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.toggleCanvas = this.toggleCanvas.bind(this);

    }
    startBar(){
        const {extSource,extOrigin,postStartCall} =  this.props
        
        postStartCall(config.FULL_SCREEN_RECORD,
            extOrigin,null,extSource,config.RECORD_TIME,null)
        var timeAlotedNew = config.RECORD_TIME * 60 * 16
         var progressbar = document.querySelector('#pbar');
         var progresDiv = document.querySelector(".progresDiv")
         progresDiv.style.display = "block";
         var width = 0;
         var id = setInterval(frame,75);
         function frame() {
           if (width >= 100) {
             clearInterval(id);
           } else {
             width= width+(100/timeAlotedNew); 
             progressbar.style.width=width+'%';
                   }
         }   
     }

    startRecoding(){
        var self = this
        var constraints =  null;
        var sourceId = this.props.extSourceId;
        const result = browser();
        if (result.name === "chrome") {
            constraints = { 
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
        // var ua = window.detect.parse(navigator.userAgent);
        // if(ua.browser.family === "Chrome"){
       
        // }
        if (result.name === "firefox") {
            constraints = {
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
            var videoTracks = screenStream.getVideoTracks();
                videoTracks.forEach(function(track) {
                    finalStream.addTrack(track);
                });

            var audioTracks = audioStream.getAudioTracks();
                audioTracks.forEach(function(track) {
                    finalStream.addTrack(track);
                });

            var recorder1 = RecordRTC(finalStream, {
                type: 'video'
            });
            self.props.setStream(audioStream,screenStream,finalStream)

            recorder1.startRecording();
            self.props.fullStartedRecording();

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
            if(event.data.type){
                if(event.data.type === config.END_RECORD_FROM_EXTENSION){
                    self.recordScreenStop()
                }
            }
            if(event.data.type === config.PERMISSION_DENIED){
                self.setState({permissonDenied:true})
            }
            if (event.data.sourceId !== undefined) {
             
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

   

    renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            var source = this.props.extSource
            var origin = this.props.extOrigin
            const END_RECORD_TIME_END = {
                type:config.END_RECORD_TIMEOUT
            }
            if (this.props.extSource !== null) {
                console.log("posting from webpage")
                source.postMessage(END_RECORD_TIME_END, origin);
            }
            else{
                window.postMessage(END_RECORD_TIME_END, '*');
            }
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
        // var mainBtn = document.querySelector('.mainBtn');
        // mainBtn.style.backgroundColor="rgb(133, 39, 39)";
        // this.convey.style.display="none"
        var source = this.props.extSource
        var origin = this.props.extOrigin
        const GET_SOURCE_ID = {
            type:config.GET_SOURCE_ID_AUDIO_TAB
        }
        if (this.props.extSource!==null) {
            source.postMessage(GET_SOURCE_ID, origin);
        }
        else{
            window.postMessage(GET_SOURCE_ID, '*');
        }
    }

    toggle(){
        if(this.props.isFullScreenRecording){
            this.recordScreenStop()
        }
        else{
            
            this.receiveMessage()
            this.startRecoding()
           
        }
    }
    saveClicked(){
    // this.props.savefile(this.state.blob)
    this.setState({
        saveBtnClicked: true
    })
}

savefilePublic(textData) {
    this.props.savefile(this.state.blob,1, textData,config.SERVER_RECORDING)
   
}
savefilePrivate(textData) {
    var blob = this.state.blob
    this.props.savefile(blob, 0, textData,config.SERVER_RECORDING)
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
        var finalStream = this.props.finalStream
        if (recorder1) {
            recorder1.stopRecording(function () {
                var blob = recorder1.getBlob();
                self.setState({
                    downloadUrl: URL.createObjectURL(blob),
                    blob: blob
                })

                audioStream.stop();
                screenStream.stop();
                finalStream.stop()
                // 
            });
        }
        else{
            if(audioStream!==null)  audioStream.stop();
            if(screenStream!=null) screenStream.stop();
            if(finalStream!=null) finalStream.stop();
            
        }
        audioStream = this.state.audioStream;
        screenStream = this.state.screenStream;
        finalStream = this.state.finalStream;
        if(audioStream!==null)  audioStream.stop();
        if(finalStream!==null)  finalStream.stop();
        if(screenStream!=null) screenStream.stop();
        
        self.props.fullStopedRecording()
      
        this.setState({
            recorder: null,
            audioStream: null,
            screenStream: null,
        })
    }
    componentWillMount(){
        var self = this
        const result = browser();
        if(config.ENVIRONMENT!=="test"){
        if (result.name === "chrome") {
    
          var img;
          img = new Image();
          img.src = "chrome-extension://" + config.EXTENSION_ID + "/icon.png";
          img.onload = function () {
           self.toggle();
          };
          img.onerror = function () {
            self.setState({
              isInstalled: false
            })
          };
        }
        }
        else{
            self.toggle();
        }
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
       var recordingEle = null;
       var recordingElements = null;
       var postShareElements = null;
        if (this.props.isFullScreenRecording) {
           
            var timer = (<Countdown
                date={Date.now() + config.RECORD_TIME *60*1000}
                renderer={this.renderer}
            />)
            recordingEle = ( <div >
                <p>Recording screen</p>
                </div>)
        }
        else{
            recordingEle = (!this.state.permissonDenied?(<div >
                <p>Record the screen and share</p>
            </div>):(<div>
                <p>Permission enied to record the screen</p>
                <button className="buttonLight" onClick={this.props.reStoreDefault}>Close</button>
            </div>))
        }
        var showCanv = (this.state.showCanvas)?(
            <div className="canvToolDivCall">
            <Form onRef={ref => (this.child = ref)} />
            <p>recording screen..</p>
            </div>
        ):(   <div className="recorderInfo">
        {recordingEle}
        </div>)
       
     
        var videoplayer = " ";
        // var convey ="Start"
       
        if (this.state.downloadUrl) {
            videoplayer = (<video className="videoPlayer2" src={this.state.downloadUrl} controls={true}></video>)
           
        }
     

     
        if(this.props.isFullRecordCompleted ===false){
        recordingElements = (<div>
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
               <TimerBar />
                {timer}
                
                {/* <div className="btDiv">
                        <button className="mainBtn" ref={a=>this.convey=a} onClick={this.toggle}>{convey}</button>
                </div> */}
                {/* <div className="convey">
                    {convey}
                </div> */}
             </div>
             </div>
        )
    }
        else{
            recordingElements = null;
        }
    
       
        // var timer = null;
     
        if(this.props.isFullRecordCompleted === true && this.props.isSaved===false){
            postShareElements= (<div className = "postRecord">
            <div className="showVideoElement">
            {videoplayer}
            </div>
            <SaveElement
            shareOrRec={config.RECORDING}
            isSaveClicked={this.state.saveBtnClicked}
            saveClicked={this.saveClicked}
            discard={this.discardChanges}
            closeImidiate={this.props.reStoreDefault}
            savefilePublic={this.savefilePublic}
            savefilePrivate={this.savefilePrivate} />
       
                 {/* <p>Do you want to sav it?</p>
                 <span className="hint--bottom" aria-label="Save Call">
                <FiSave className="icons" onClick={this.savefile} />
            </span>
            <span className="hint--bottom" aria-label="Cancel">
                <FiX className="icons" onClick={this.discardChanges} />
            </span> */}
                
             </div>)
         }
         else if(this.props.isSaved ){
            // elseif {
            postShareElements= (<div className = "postRecord">
            <p><b>Your Explaination is recorded successfully :)</b></p>
                {/* <p>Your recording has been saved successfully.
               You can access it with the link below and share the same</p>
                 <CopyToClipboard sharablelink = {this.props.sharablelink} />
                    <button className="buttonDark" 
                    style={{marginTop:"50px"}} 
                    onClick={this.closeFunction}>Go Back</button> */}
             </div>)

         }
        //  else if(this.state.saveBtnClicked && !this.props.isSaved){
        //     var postShareElements= (<div>
        //          <p>Save processing..</p>
        //      </div>)
        //  }
       
       
        // if (this.state.shareScreenLink) {
        //     var linkElement = (<p>{this.state.shareScreenLink}</p>)
        // }
        return (this.state.isInstalled) ? (
            <div className="recordMainScreen explainItRec">
            {/* {closeBtn} */}
            
               {recordingElements}
                {postShareElements}
             </div>
        ):(<div >
            {/* <Navbar /> */}
            <div className="messageToDownload">
              <h3>Please down the chrome extension to continue</h3>
              <button className="buttonDark" onClick={this.downloadExtension}>Download Extension</button>
            </div>
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
    hideCanvas: PropType.func.isRequired,
    cancelAllMessageAction:PropType.func.isRequired,
    restAllToolValue:PropType.func.isRequired,
    postStartCall:PropType.func.isRequired
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
    timeAloted: state.call.noOfMinutes,

}) 

export default connect(mapStateToProps,{saveSourceId,
    cancelAllMessageAction,
    restAllToolValue,
     showCanvas, hideCanvas,postStartCall,fullStartedRecording, setStream,discardAfterRecord, fullStopedRecording})(FullScreenRecorder)

