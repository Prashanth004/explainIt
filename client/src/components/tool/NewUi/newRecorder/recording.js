import React, { Component } from 'react';
import config from '../../../../config/config';
import { saveSourceId, postStartCall } from "../../../../actions/extensionAction";
import { connect } from 'react-redux';
import browser from 'browser-detect';
import RecordRTC from 'recordrtc';
import { setStream } from '../../../../actions/streamActions';
import { fullStartedRecording, fullStopedRecording } from '../../../../actions/toolActions'
import { pauseRecording, resetRecorder, resumeRecording, startRecorder, stopRecorder } from '../../../../actions/recoderAction'
import { registerRecordToBrowser, registerEndToBrowser } from '../container/miscFunction'
import PropType from 'prop-types';

class Recorder extends Component {
    constructor(props) {
        super(props);
        this.startRecorder = this.startRecorder.bind(this);
        this.postMessageHandler = this.postMessageHandler.bind(this);
        this.pauseRecorder = this.pauseRecorder.bind(this);
        this.resumeRecorder = this.resumeRecorder.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
    }
    componentWillMount() {

    }
    postMessageHandler(event) {
        var self = this;
        if (event.data.type) {
            if (event.data.type === config.END_RECORD_FROM_EXTENSION) {
                self.stopRecording();
            }
        }
        else if (event.data.type === config.PAUSE_TO_WEB) {
            self.pauseRecorder();
            return
        }
        else if (event.data.type === config.RESUME_TO_WEB) {
            self.resumeRecorder();
            return
        }
        else if (event.data.type === config.PERMISSION_DENIED) {
            self.setState({ permissonDenied: true });
        }
        else if (event.data.sourceId !== undefined) {
            self.props.saveSourceId(event.data.sourceId);
            self.startRecorder();
        }

    }
 
    componentDidMount() {
        const { extSource, extOrigin, extSourceId } = this.props;
        const GET_SOURCE_ID = { type: config.GET_SOURCE_ID_AUDIO_TAB }
        var self = this;
        console.log("extSource : ",extSourceId);
        if (extSourceId === null) {
            console.log("i am callinf extension")
            if (extSource !== null)
                extSource.postMessage(GET_SOURCE_ID, extOrigin);
            else
                window.postMessage(GET_SOURCE_ID, '*');
            if (window.addEventListener)
                window.addEventListener("message", this.postMessageHandler, false);
            else
                window.attachEvent("onmessage", this.postMessageHandler);
        }

        else
            self.startRecorder();


    }
   
    startRecorder() {
        var constraints = null;
        registerRecordToBrowser();
        var { extSourceId, startRecorder, setStream, fullStartedRecording, extSource, extOrigin, postStartCall } = this.props;
        postStartCall(config.FULL_SCREEN_RECORD, extOrigin, null, extSource, 3, null);
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
                        chromeMediaSourceId: extSourceId
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
        navigator.mediaDevices.getUserMedia({ audio: true }).then((audioStream) => {
            navigator.mediaDevices.getUserMedia(constraints).then((screenStream) => {
                console.log("Streams : ",audioStream)
                var finalStream = new MediaStream();
                var videoTracks = screenStream.getVideoTracks();
                var audioTracks = audioStream.getAudioTracks();
                videoTracks.forEach((track) => { finalStream.addTrack(track); });
                audioTracks.forEach((track) => { finalStream.addTrack(track); });
                var recorder1 = RecordRTC(finalStream, { type: 'video' });
                setStream(audioStream, screenStream, finalStream);
                recorder1.startRecording();
                startRecorder(recorder1);
                fullStartedRecording();
            });
        })
    }
    pauseRecorder() {
        const { recorder, pauseRecording } = this.props;
        if (this.props.recorder !== null)
            if (this.props.recorder.state === "recording") {
                this.props.recorder.pauseRecording();
                pauseRecording(recorder);
            }
    }
    resumeRecorder() {
        const { recorder, resumeRecording } = this.props;
        this.updateTime()
        if (this.props.recorder !== null)
            if (this.props.recorder.state === "paused") {
                recorder.resumeRecording();
                resumeRecording(recorder);
            }
    }
    stopRecording() {
        registerEndToBrowser();
        const { audioStream, screenStream, fullStopedRecording, finalStream, recorder, stopRecorder } = this.props;
        if (recorder)
            recorder.stopRecording(function () {
                var blob = recorder.getBlob();
                var downLoadUrl = URL.createObjectURL(blob);
                console.log("blob : ", blob);
                console.log("downLoadUrl : ", downLoadUrl)
                stopRecorder(downLoadUrl, blob)
            });
        if (audioStream !== null) audioStream.stop();
        if (screenStream !== null) screenStream.stop();
        if (finalStream !== null) finalStream.stop();
        fullStopedRecording()
    }
    render() {

        const { isFullScreenRecording, isFullRecordCompleted, downLoadUrl, saved, discarded, blob } = this.props;
        console.log("downloadUrl : ", downLoadUrl)
        const Content = (isFullRecordCompleted ? (!((saved || discarded)) ? ((this.props.downLoadUrl !== null) ? (<div>
            <video width="100%" src={this.props.downLoadUrl} controls></video>
            <button className="buttonDark" onClick={() => this.props.save(blob)}>Accept </button>
            <button className="buttonDark" onClick={this.props.discard}>Discard</button>
        </div>) : (<p>Preparing to preview</p>)) : (saved ? (<p>Saved Successfully</p>) : (null))) : (
                isFullScreenRecording ? (<p>Recording your screen</p>) : (<p>Preparing to record</p>)
            ))
        return (<div className="recorderContainer">
            {Content}
        </div>)
    }
}

Recorder.PropType = {
    saveSourceId: PropType.func.isRequired,
    postStartCall: PropType.func.isRequired,
    stopRecorder: PropType.func.isRequired
};
const mapStateToProps = state => ({
    recorder: state.recorder.recorder,
    downLoadUrl: state.recorder.downLoadUrl,
    blob: state.recorder.blob,
    isFullScreenRecording: state.tools.isFullScreenRecording,
    isFullRecordCompleted: state.tools.isFullRecordCompleted,
    extSource: state.extension.source,
    extOrigin: state.extension.origin,
    extSourceId: state.extension.sourceId,
    audioStream: state.stream.audioStream,
    screenStream: state.stream.screenStream,
    finalStream: state.stream.finalStream
})

export default connect(mapStateToProps, {
    stopRecorder, postStartCall, saveSourceId, setStream, fullStartedRecording,
    fullStopedRecording, pauseRecording, resumeRecording, startRecorder, resetRecorder
})(Recorder)

