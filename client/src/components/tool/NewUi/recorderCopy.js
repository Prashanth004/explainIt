import React, { Component } from 'react'
import RecordRTC from 'recordrtc'
// import Recorder from 'recorder-js';
export default class componentName extends Component {
    constructor(props){
        super(props)
        this.state={
            audioStream:null,
            recorder:null,
            audioSrc:null,
            audioVisibility:"none",
            blob:null
        }
        this.startRec = this.startRec.bind(this);
        this.stopRec = this.stopRec.bind(this);
    }
    startRec(){
        setTimeout(()=>{
            self.stopRec()
        },10*1000)
        const self = this;
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (audioStream) {
            var recorder = RecordRTC(audioStream, {
                type: 'audio'
            });
            recorder.startRecording();
            self.setState({
                audioStream:audioStream,
                recorder:recorder
            })
        })
    }
    stopRec(){
      const recorder = this.state.recorder;
      const audioStream =this.state.audioStream;
      const self = this;
      if(recorder!== null){
        recorder.stopRecording(function () {
            var blob = recorder.getBlob();
            self.setState({
                audioSrc: URL.createObjectURL(blob),
                blob: blob,
                audioVisibility:"block"
            })
            audioStream.stop();
        })
    }
    }
  render() {
    return (
      <div>
        <button className="buttonDark" onClick={this.startRec}>Start</button>
        <button className="buttonDark" onClick={this.stopRec}>Stop</button>
        <a href={this.state.audioSrc}
        download="data.mp3"
        >download</a>
        <audio src={this.state.audioSrc}
         display={this.state.audioVisibility} controls={true}></audio>
      </div>
    )
  }
}
