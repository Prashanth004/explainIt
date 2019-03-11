import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc';
import CopyToClipboard from '../CopytoClipboard';
import Dummy from './dummy'
import {
    fullStartedRecording,
    fullStopedRecording, discardAfterRecord
} from '../../../actions/toolActions'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import {sendMessage} from '../../../actions/messageAction';
import browser from 'browser-detect';


class FullScreenRecorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recorder: null,
            downloadUrl: null,
            audioStream: null,
            screenStream: null,
            blob: null,
            finalStream: null,
            percentage: "0%",
            copyStatus: "copy link",
            result:null

        }
        this.recordScreenStop = this.recordScreenStop.bind(this);
        this.renderer = this.renderer.bind(this);
        this.startBar = this.startBar.bind(this);
        this.startRecoding = this.startRecoding.bind(this);
        this.toggle = this.toggle.bind(this);
        this.savefile = this.savefile.bind(this);
        this.discardChanges = this.discardChanges.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.sendMessageLocal = this.sendMessageLocal.bind(this)
    }

    startRecoding() {
        var self = this
        var sourceId = this.props.extSourceId;
        if(this.state.result.name === "chrome"){
            var constraints = {
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        maxWidth: 2020,
                        maxHeight: 600,
                        maxFrameRate: 100,
                        minAspectRatio: 1.75,
                        chromeMediaSourceId: sourceId
                    }
                }
            };
        }
        else if (this.state.result.name === "firefox") {
            var constraints = {
                video: {
                    mediaSource: "screen",
                    width: { max: '1920' },
                    height: { max: '1080' },
                    frameRate: { max: '10' }
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
                recorder1.startRecording();
                self.setState({
                    recorder: recorder1,
                    audioStream: audioStream,
                    screenStream: screenStream,
                    finalStream: finalStream,
                })
                self.props.startDraw()
            }).catch(err => {
                console.log(" error : ", err)
            })
        }).catch(err => {
            console.log("error ouucres : ", err)
        })
    }
    componentWillMount(){
        const result = browser();
        this.setState({
            result:result
        })
    }
    startBar() {
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
                width = width + (100 / 90);
                console.log("......")
                progressbar.style.width = width + '%';
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
    discardChanges() {
        // this.props.clearCanvas();
        // this.props.discardAfterRecord();

        window.location.reload();

    }
    receiveMessage() {

        console.log("i reached insoide start Recording")
        var mainBtn = document.querySelector('.mainBtn');
        mainBtn.style.backgroundColor = "rgb(133, 39, 39)";
        this.convey.innerText = "Stop"
        var source = this.props.extSource
        var origin = this.props.extOrigin
        if (this.props.extSource !== null) {
            source.postMessage('audio-plus-tab', origin);
        }
    }

    toggle() {
        console.log("this.props.isFullScreenRecording : ", this.props.isFullScreenRecording)
        if (this.props.isFullScreenRecording) {
            this.recordScreenStop()
        }
        else {

            this.receiveMessage()
            this.startRecoding()
            this.props.fullStartedRecording();
        }
    }
    savefile() {
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
        var screenStream = this.state.screenStream;
        console.log("recording : ", recorder1)
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
        else {
            alert("Some thign went wrong")
        }
        this.setState({
            recorder: null,
            audioStream: null,
            screenStream: null,
        })
    }

    render() {
        if(this.state.result!==null){
            if (this.state.result.name === "chrome") {
                if (this.props.sourceId !== null) {
                    console.log("render source id calling function : ", this.props.sourceId)
                    this.startRecoding()
                }
            }
        }
        
        if (this.props.isFullScreenRecording) {
            this.startBar()
            var timer = (<Countdown
                date={Date.now() + 180000}
                renderer={this.renderer}
            />)
        }
        var videoplayer = " ";
        var downLinkAudio = " ";
        var linkElement = " ";
        var convey = (<p ref={a => this.convey = a}>Start</p>)

        if (this.state.downloadUrl) {
            videoplayer = (<video className="videoPlayer2" src={this.state.downloadUrl} controls={true}></video>)

        }



        if (this.props.isFullRecordCompleted === false) {
            var recordingElements = (<div>
                <div className="progresDiv">
                    <div className="progress" id="pbar" ></div>
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
        else {
            var recordingElements = null;
        }
        if(this.props.isSaved && !this.props.sendSuccess){
            console.log("i a, here twoice?")
                this.sendMessageLocal() 
        }

        if (this.props.isFullRecordCompleted === true && this.props.isSaved === false) {
            var postShareElements = (<div className="postRecord">
                <div classNam="showVideoElement">
                    {videoplayer}
                </div>

                <p>Do you want to send it?</p>
                <button onClick={this.savefile} className="buttonLight save">
                    Send
                 </button>
                <button onClick={this.discardChanges} className="buttonDark save">
                    Discard
                 </button>
            </div>)
        }
        else if (this.props.sendSuccess) {
            var postShareElements = (<div className="postRecord">
                <p><b>The recording successfully sent</b></p>
                <p>Link to access your saved project</p>
                <CopyToClipboard sharablelink={this.props.sharablelink} />

            </div>)
        }
        else if (this.props.isSaved) {
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
FullScreenRecorder.PropType = {
    fullStartedRecording: PropType.func.isRequired,
    fullStopedRecording: PropType.func.isRequired,
    discardAfterRecord: PropType.func.isRequired,
    sendMessage:PropType.func.isRequired

}
const mapStateToProps = state => ({
    isFullScreenRecording: state.tools.isFullScreenRecording,
    isFullRecordCompleted: state.tools.isFullRecordCompleted,
    isSaved: state.issues.successCreation,
    sharablelink: state.issues.sharablelink,
    extSource: state.extension.source,
    extOrigin: state.extension.origin,
    extSourceId: state.extension.sourceId,
    fromId : state.auth.id,
    toId:state.visitProfile.id,
    sendSuccess:state.message.sendSuccess
})

export default connect(mapStateToProps, {sendMessage, fullStartedRecording, discardAfterRecord, fullStopedRecording })(FullScreenRecorder)

