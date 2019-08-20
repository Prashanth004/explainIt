import React, { Component } from 'react'
import { FULL_SCREEN_RECORD, FULL_SCREEN_SHARE } from '../../../actions/types';

import PreScreenRecord from './screenRecord/preScreenRecord'
import RecordRTC from 'recordrtc';
import { pauseRecording, resetRecorder, resumeRecording, startRecorder } from '../../../actions/recoderAction'
import config from '../../../config/config';
import { updateCurrentTime } from '../../../actions/callAction'
import CopyToClipboard from '../CopytoClipboard';
import { setStream } from '../../../actions/streamActions'
import { postEndCall, saveSourceId } from "../../../actions/extensionAction";
import { registerRecordToBrowser, registerEndToBrowser } from './container/miscFunction'
import Dummy from './dummy';
import { postStartCall } from '../../../actions/extensionAction'
import SaveElement from './saveRecording'
import { showCanvas, hideCanvas } from '../../../actions/canvasAction'
import { Button } from 'reactstrap';
import browser from 'browser-detect';
import { sendMessage, saveRecordedMessage } from '../../../actions/messageAction';
import DownloadExt from './container/DownloadExt'
import {
    fullStartedRecording,
    fullStopedRecording, discardAfterRecord
} from '../../../actions/toolActions';
import { explainSuccessedUpate } from '../../../actions/explainAction'
import { connect } from 'react-redux';
import PropType from 'prop-types';

class FullScreenRecorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            downloadUrl: null,
            audioStream: null,
            screenStream: null,
            blob: null,
            finalStream: null,
            percentage: "0%",
            copyStatus: "copy link",
            saveBtnClicked: false,
            showCanvas: false,
            isInstalled: true,
            subjectOfMessage: null,
            sendBtnClicked: false,
            savedfuncCalled: false,
            permissonDenied: false,
            currentTime: {},
            recordTime: 3,
            currentAtionStatus: null,
            saveActivity: false,
            selfSave:false,
            savedRecordActivity:false,
            mobile:false,
            firefox:false,
            chrome:true
        }
        this.downloadExtension = this.downloadExtension.bind(this);
        this.recordScreenStop = this.recordScreenStop.bind(this);
        this.savefilePrivate = this.savefilePrivate.bind(this);
        this.renderer = this.renderer.bind(this);
        this.startBar = this.startBar.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.toggle = this.toggle.bind(this);
        this.saveClicked = this.saveClicked.bind(this);
        this.discardChanges = this.discardChanges.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.toggleCanvas = this.toggleCanvas.bind(this);
        this.sendMessageLocal = this.sendMessageLocal.bind(this);
        this.sendButtonClick = this.sendButtonClick.bind(this);
        this.onUnload = this.onUnload.bind(this);
        this.pauseRecorder = this.pauseRecorder.bind(this);
        this.resumeRecorder = this.resumeRecorder.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.timebar = this.timebar.bind(this);
        this.cancelSaveBtn = this.cancelSaveBtn.bind(this);
        this.saveforSelf = this.saveforSelf.bind(this);
        this.saveActivityJustRecord = this.saveActivityJustRecord.bind(this)
    }
    timebar = () => { }
    startBar() {
        const self = this;
        const { extSource, extOrigin, postStartCall } = this.props;
        postStartCall(config.FULL_SCREEN_RECORD,
            extOrigin, null, extSource, this.state.recordTime, null);
        var timeAlotedNew = this.state.recordTime * 60
        var progressbar = document.querySelector('#pbar');
        var progresDiv = document.querySelector(".progresDiv")
        progresDiv.style.display = "block";
        var width = 0;
        this.timebar = setInterval(frame, 1000);

        function frame() {
            if (width >= 100 || !self.props.isFullScreenRecording) {
                clearInterval(self.timebar);
            } else {
                if (self.props.pauseState) {
                } else {
                    width = width + (100 / timeAlotedNew);
                    progressbar.style.width = width + '%';
                }

            }
        }
    }

    saveActivityJustRecord() {
        var subject = this.state.subjectOfMessage;
        this.setState({savedRecordActivity:true})
        this.props.sendMessage(this.props.sharablelink, this.props.callTopic, this.props.fromId, this.props.twitterUserId, subject)
    }
    startRecording() {
        console.log("starting recording")
        var self = this;
        var constraints = null;
        registerRecordToBrowser();
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
                        minAspectRatio: 1.75,
                        chromeMediaSourceId: sourceId
                    }
                }
            };
        }
        if (result.name === "firefox") {
            constraints = {
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
                var videoTracks = screenStream.getVideoTracks();
                videoTracks.forEach(function (track) {
                    finalStream.addTrack(track);
                });

                var audioTracks = audioStream.getAudioTracks();
                audioTracks.forEach(function (track) {
                    finalStream.addTrack(track);
                });

                var recorder1 = RecordRTC(finalStream, {
                    type: 'video'
                });
                self.props.setStream(audioStream, screenStream, finalStream);
                console.log("started recording")
                self.props.fullStartedRecording();
                recorder1.startRecording();
                self.props.startRecorder(recorder1);
                self.setState({
                    audioStream: audioStream,
                    screenStream: screenStream,
                    finalStream: finalStream,
                })
                self.startBar()

            }).catch(err => {
                console.log(" error : ", err)
            })

        }).catch(err => {
            console.log("error ouucres : ", err)
        })
    }
    onUnload(event) {
        registerEndToBrowser();
        if (this.props.isFullScreenRecording) {
            const { extSource, extOrigin, postEndCall } = this.props;
            postEndCall(config.END_SCREED_RECORD_FROM_WEB, extSource, extOrigin);
            this.recordScreenStop();
            event.returnValue = " "
        }
        else { }
    }
    componentDidMount() {
        var self = this;
        window.addEventListener("beforeunload", this.onUnload);
        function postMessageHandler(event) {
            console.log("event : ",event)
            if (event.data.type) {
                if (event.data.type === config.END_RECORD_FROM_EXTENSION) {
                    self.recordScreenStop()
                }
            }
            if (event.data.type === config.PAUSE_TO_WEB) {
                self.pauseRecorder();
                return
            }
            if (event.data.type === config.RESUME_TO_WEB) {
                self.resumeRecorder();
                return
            }
            if (event.data.type === config.PERMISSION_DENIED) {
                self.setState({ permissonDenied: true })
            }
            else if (event.data.sourceId !== undefined) {
                console.log("self.props.screenAction : ",self.props.screenAction);
                console.log("FULL_SCREEN_SHARE : ",FULL_SCREEN_RECORD);
                // if(self.props.screenAction === FULL_SCREEN_RECORD){

                console.log("event for recording: ",event)
                self.props.saveSourceId(event.data.sourceId)
                self.startRecording();
                // }
            }

        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }
    }
    copyToClipboard() {
        var copyText = document.querySelector('.myInput');
        copyText.select();
        document.execCommand("copy");
        this.setState({
            copyStatus: "link copied"
        })
    }



    renderer = ({ hours, minutes, seconds, completed }) => {
        var currentTime = null;
        localStorage.setItem("timer", (minutes + (seconds / 60)))
        var curTime = {
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
        if (this.props.pauseState) {
            if ((minutes + (seconds / 60)) === 0.1)
                this.updateTime()
            currentTime = JSON.parse(localStorage.getItem('curTime'));
            return <span>{currentTime.hours}:{currentTime.minutes}:{currentTime.seconds}</span>;
        }
        else {
            if (curTime.minutes !== config.RECORD_TIME)
                localStorage.setItem('curTime', JSON.stringify(curTime))

            if (completed) {
                var source = this.props.extSource
                var origin = this.props.extOrigin
                const END_RECORD_TIME_END = {
                    type: config.END_RECORD_TIMEOUT
                }
                if (this.props.extSource !== null) {
                    source.postMessage(END_RECORD_TIME_END, origin);
                }
                else {
                    window.postMessage(END_RECORD_TIME_END, '*');
                }
                this.recordScreenStop()
                return (<Dummy></Dummy>)
            } else {
                return <span>{hours}:{minutes}:{seconds}</span>;
            }
        }
    };
    discardChanges() {

        window.location.reload();
    }

    receiveMessage() {
        var source = this.props.extSource
        var origin = this.props.extOrigin
        const GET_SOURCE_ID = {
            type: config.GET_SOURCE_ID_AUDIO_TAB
        }
        if (this.props.extSource !== null) {
            source.postMessage(GET_SOURCE_ID, origin);
        }
        else {
            window.postMessage(GET_SOURCE_ID, '*');
        }
    }

    toggle(time) {
     
        this.setState({recordTime:time});
        var curTime = {
            'hours': 0,
            'minutes':time,
            'seconds': 0
        }
        localStorage.setItem('curTime',JSON.stringify(curTime));
        if (this.props.isFullScreenRecording) {
            this.recordScreenStop()
        }
        else {
            const result = browser();
            if (result.name === "chrome")
                this.receiveMessage()
            else
                this.startRecording()
        }
    }
    cancelSaveBtn() {
        this.setState({
            saveBtnClicked: false,
            sendBtnClicked: false
        })
    }
    saveforSelf(){
        this.setState({selfSave : true})
    }
    saveClicked() {
        this.setState({ saveBtnClicked: true })
    }


    savefilePrivate(textData) {
        var blob = this.state.blob
        this.setState({ subjectOfMessage: textData });
        this.props.savefile(blob, null, 0, textData, config.SERVER_RECORDING)
    }

    toggleCanvas() {
        if (this.state.showCanvas)
            this.props.hideCanvas()
        else this.props.showCanvas()
        this.setState({
            showCanvas: !this.state.showCanvas
        })
    }
    recordScreenStop() {
        localStorage.setItem('infoDisplay', JSON.stringify(config.RECORDING_ENDED_INFO))
        registerEndToBrowser()
        var self = this;
        var { recorder } = this.props;
        var audioStream1 = this.props.audioStream;
        var screenStream1 = this.props.screenStream;
        var audioStream = this.state.audioStream;
        var screenStream = this.state.screenStream;
        var finalSTream = this.state.finalStream;
        if (recorder) {
            recorder.stopRecording(function () {
                var blob = recorder.getBlob();
                self.setState({
                    downloadUrl: URL.createObjectURL(blob),
                    blob: blob
                })
            });
        }
        if (audioStream1 !== null) audioStream1.stop();
        if (screenStream1 !== null) screenStream1.stop();
        if (audioStream !== null) audioStream.stop();
        if (screenStream !== null) screenStream.stop();
        if (finalSTream !== null) finalSTream.stop()
        self.props.fullStopedRecording()
        this.setState({
            recorder: null,
            audioStream: null,
            screenStream: null,
        })

    }
    downloadExtension() {
        window.open(config.EXTENSION_URL, "_self")

    }

    componentWillMount() {
        clearInterval(this.timebar);
        this.setState({ recordTime: config.RECORD_TIME })
        const self = this;
        this.props.resetRecorder()
        const { extSource, extOrigin } = this.props;
        var curTime = {
            'hours': 0,
            'minutes': config.RECORD_TIME,
            'seconds': 0
        }
        localStorage.setItem('curTime', JSON.stringify(curTime));
        localStorage.setItem('pauseState', JSON.stringify(config.RESUMED_RECORDER))
        localStorage.setItem('action', JSON.stringify(config.FULL_SCREEN_RECORD))
        const refreshFloater = {
            type: config.REFRESH_EXPLAIN_FLOATER,
            data: {}
        }
        if (extSource !== null)
            extSource.postMessage(refreshFloater, extOrigin);
        else
            window.postMessage(refreshFloater, "*")

        localStorage.setItem('timer', JSON.stringify(config.RECORD_TIME))
        const result = browser();
        if(result.mobile){
            self.setState({
                mobile:true,
                chrome:false
            })
        }
        if (config.ENVIRONMENT !== "test") {
            if (result.name === "chrome") {

                var img;
                img = new Image();
                img.src = "chrome-extension://" + config.EXTENSION_ID + "/icon.png";
                img.onload = function () {

                };
                img.onerror = function () {
                    self.setState({
                        isInstalled: false,
                        chrome:true,
                    })
                };
            }
            else if(result.name === "firefox"){
                self.setState({
                    chrome:false,
                    firefox:true})
            }
            else if(result.mobile){
                self.setState({
                    mobile:true,
                    chrome:false
                })
            }
            else{
                console.log("browser : ",result.name);
                self.setState({ chrome:false});
            }
        }
    }
    sendMessageLocal() {
        this.setState({ savedfuncCalled: true })
        var subject = this.state.subjectOfMessage
        this.props.sendMessage(this.props.sharablelink, this.props.callTopic, this.props.fromId, this.props.twitterUserId, subject)
    }
    componentWillUnmount() {
        registerEndToBrowser();
        clearInterval(this.timebar);
        this.props.resetRecorder()
        window.removeEventListener("beforeunload", this.onUnload)
        this.props.fullStopedRecording()
        var audioStream = this.state.audioStream;
        var screenStream = this.state.screenStream;
        if (audioStream !== null && screenStream !== null) {
            audioStream.stop();
            screenStream.stop();
        }

    }

    sendButtonClick() {
        this.setState({ sendBtnClicked: true })
    }

    pauseRecorder() {
        const { recorder, pauseRecording } = this.props;
        if (this.props.recorder !== null)
            if (this.props.recorder.state === "recording") {
                this.props.recorder.pauseRecording();
                pauseRecording(recorder);
            }
        }
    updateTime() {
        var currentTime = JSON.parse(localStorage.getItem('curTime'));
        var time = (currentTime.minutes + (currentTime.seconds / 60));
        this.setState({ recordTime: time })
    }
    resumeRecorder() {
        const { recorder, resumeRecording } = this.props;
        this.updateTime()
        if(this.props.recorder!==null){
            if (this.props.recorder.state === "paused") {
                recorder.resumeRecording();
                resumeRecording(recorder);
            }
        }   
}
    render() {
        var postShareElements = null;
        const videoplayer = (this.state.downloadUrl && !this.state.sendBtnClicked && !this.state.saveBtnClicked) ?
            (<div className="showVideoElement">
                <video className="videoPlayer2" src={this.state.downloadUrl} controls={true}></video>
            </div>) : (null)
        const closeFunction = (this.props.isFullScreenRecording) ? this.props.reStoreDefault :
            this.props.closeImidiate

        const closeBtn = ((!this.props.isFullScreenRecording && this.props.explainBy === config.null) ?
            ((this.props.isFullRecordCompleted && !this.state.sendBtnClicked && !this.state.saveBtnClicked) ?
                (null) : (
                    <div className="topBtnsActivity"><Button close onClick={closeFunction} /></div>)) : (null))
        const recordingElements = (!this.props.isFullRecordCompleted)?(
            <PreScreenRecord 
            saveforSelf={this.saveforSelf}
            renderer ={this.renderer}
            recordTime ={this.state.recordTime}
            toggle ={this.toggle}
            turnReRecordWrong={this.props.turnReRecordWrong}
            isFullScreenRecording = {this.props.isFullScreenRecording}
            permissonDenied = {this.state.permissonDenied}
            closeFunction={closeFunction}
            />):(null)

        if (this.props.isSaved && !this.state.saveBtnClicked && !this.state.savedfuncCalled && this.props.twitterUserId !== null && !this.props.sendSuccess) {
            this.sendMessageLocal()
        }
        if (this.props.isSaved && this.state.saveBtnClicked && !this.state.savedRecordActivity)
            this.saveActivityJustRecord()
        if (this.props.isFullRecordCompleted && !this.props.isSaved) {
            postShareElements = (<div className="postRecord">
                {videoplayer}
                <SaveElement
                    selfSave = {this.state.selfSave}
                    hideVideotag={this.hideVideotag}
                    shareOrRec={config.RECORDING}
                    isSaveClicked={this.state.saveBtnClicked}
                    saveClicked={this.saveClicked}
                    sendButtonClick={this.sendButtonClick}
                    discard={this.discardChanges}
                    closeImidiate={this.props.closeImidiate}
                    savefilePublic={this.savefilePublic}
                    cancelSaveBtn={this.cancelSaveBtn}
                    savefilePrivate={this.savefilePrivate} />
            </div>);
        }
        else if (this.props.isSaved && this.state.saveBtnClicked) {
            
            var cpyTpclipBrd = (this.props.explainBy !== config.null) ? (null) :
                (<CopyToClipboard sharablelink={this.props.sharablelink} />)
            postShareElements = this.props.explainBy === config.null?(<div className="postRecord">
                <span>Your recording has been saved successfully.
               You can access it with the link below and share the same</span>
                {cpyTpclipBrd}
            </div>):(<div className="postRecord">
                <span>Your recording has been saved successfully</span>
            </div>)
            }


        else if (this.props.sendSuccess) {
            postShareElements = (<div className="postRecord">
                <p><b>The recording successfully sent to {this.props.twitterName}</b></p>
                <p>Link to access your saved project</p>
                <CopyToClipboard sharablelink={this.props.sharablelink} />

            </div>)
        }

        else if (this.props.isSaved && this.props.isFullRecordCompleted) {
            postShareElements = (<div>
                <p>Sending the message. Please wait..</p>
            </div>)

        }

        return (!this.state.mobile)?(
            (this.state.isInstalled) ? (
            this.state.chrome?((<div className="recordMainScreen" style={{borderStyle:"none",margin:"none"}} >
                {closeBtn}
                <div >
                    {recordingElements}
                </div>
                {postShareElements}
            </div>)
        ) : (<div>
            <DownloadExt />
        </div>)):((this.state.firefox)?(<div>{closeBtn}  <p>We don't support this browser for now.</p></div>):
        (<p>We dont support this browser for now</p>)
            
        )):(<div>{closeBtn}Please use desktop version to continue</div>)
    }
}
FullScreenRecorder.PropType = {
    fullStartedRecording: PropType.func.isRequired,
    fullStopedRecording: PropType.func.isRequired,
    discardAfterRecord: PropType.func.isRequired,
    saveSourceId: PropType.func.isRequired,
    setStream: PropType.func.isRequired,
    showCanvas: PropType.func.isRequired,
    hideCanvas: PropType.func.isRequired,
    sendMessage: PropType.func.isRequired,
    postStartCall: PropType.func.isRequired,
    saveRecordedMessage: PropType.func.isRequired


}
const mapStateToProps = state => ({
    isFullScreenRecording: state.tools.isFullScreenRecording,
    isFullRecordCompleted: state.tools.isFullRecordCompleted,
    isSaved: state.issues.successCreation,
    sharablelink: state.issues.sharablelink,
    extSource: state.extension.source,
    extOrigin: state.extension.origin,
    extSourceId: state.extension.sourceId,
    audioStream: state.stream.audioStream,
    fromId: state.auth.id,
    screenStream: state.stream.screenStream,
    sendSuccess: state.message.sendSuccess,
    twitterUserId: state.twitterApi.twitterId,
    twitterName: state.twitterApi.name,
    currentTimeLeft: state.call.currentTimeLeft,
    pauseState: state.recorder.pauseState,
    recorder: state.recorder.recorder,
    timeAloted: state.call.noOfMinutes,
    explainBy: state.explain.explainBy,
    callTopic: state.call.topicOfTheCall,
    shareid:state.explain.shareid,
    topicIssueId:state.explain.issueId,
    currentTime: state.recorder.currentTime,
    screenAction: state.tools.screenAction,


})

export default connect(mapStateToProps, { postStartCall,explainSuccessedUpate, saveRecordedMessage, resetRecorder, pauseRecording, resumeRecording, startRecorder, updateCurrentTime, postEndCall, sendMessage, saveSourceId, showCanvas, hideCanvas, fullStartedRecording, setStream, discardAfterRecord, fullStopedRecording })(FullScreenRecorder)

