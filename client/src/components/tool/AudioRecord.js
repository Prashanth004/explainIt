import React, { Component } from 'react'
import '../css/audiocomp.css'
import Countdown from 'react-countdown-now';
import Dummy from './dummy'
import RecordRTC from 'recordrtc'
// import Recorder from 'recorder-js';
// import app from '../app'


class Recoder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            URL: window.URL || window.webkitURL,
            gumStream: null,
            downloadUrl: "",						//stream from getUserMedia()
            rec: null,					//Recorder.js object
            input: null,
            AudioContext: window.AudioContext || window.webkitAudioContext,
            audioContext: null,
            startBtn: false,
            stopBtn: true,
            pauseBtn: true,
            isAudioRecDone: false,
            blob: null,
            isAudioRecStarted:false,
            canvas : this.props.canvass
        }
        this.startRec = this.startRec.bind(this);
        this.stopRec = this.stopRec.bind(this);
        this.createDownloadLink = this.createDownloadLink.bind(this);
        this.acceptRecording = this.acceptRecording.bind(this);
        this.discardRecording = this.discardRecording.bind(this);
        this.renderer = this.renderer.bind(this);
        this.Completionist = this.Completionist.bind(this);
        this.recordScreenStart = this.recordScreenStart.bind(this)
        this.recordScreenStop = this.recordScreenStop.bind(this)

    }
    Completionist = () => <span>You are good to go!</span>;
    renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            this.stopRec()
        return(<Dummy></Dummy>)
      
        } else {
            // Render a countdown
            return <span>{hours}:{minutes}:{seconds}</span>;
        }
    };
   
    startRec() {
        this.recordScreenStart()
        var constraints = { audio: true, video: false }
        var rec1 = " ";
        var state = this;
        this.setState({
            startBtn: true,
            stopBtn: false,
            pauseBtn: false,
            isAudioRecStarted:true,
        })
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            var audioContext1 = new AudioContext();
            var gumStream1 = stream;
            var input1 = audioContext1.createMediaStreamSource(stream);
            rec1 = new window.Recorder(input1, { numChannels: 1 })
            rec1.record()
            state.setState({
                rec: rec1,
                isRecording: "Recording....",
                gumStream: gumStream1,
                startBtn: true,
                stopBtn: false,
                pauseBtn: false,
            })
        }).catch(function (err) {
            state.setState({
                startBtn: false,
                stopBtn: true,
                pauseBtn: true,
            })
        });
    }

    acceptRecording() {
        this.setState({
            isAudioRecDone:false
        })
        this.props.assignAudioUrl(this.state.blob)
    }
    discardRecording() {
        this.setState({
            startBtn: false,
            stopBtn: true,
            isAudioRecDone: false,
            audioContext: null,
            gumStream: null,
            downloadUrl: "",
            rec: null,
            input: null,
        })
    }

    stopRec() {
        this.recordScreenStop()
        var rec1 = this.state.rec;
        var gumStream1 = this.state.gumStream;
        console.log("pauseButton clicked rec.recording=", rec1.recording);
        rec1.stop();
        gumStream1.getAudioTracks()[0].stop();
        rec1.exportWAV(this.createDownloadLink);
        this.setState({
            startBtn: false,
            stopBtn: true,
            pauseBtn: true,
            isAudioRecDone: true,
            isRecording: "",
            isAudioRecStarted:false,
            video:'',
            recorder: null,
            audioStream:null,
            canvasStream:null,  
            initialsize:false
        })
     
        console.log("paused");
       
    }
    recordScreenStart() {
        var states=this
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (audioStream) {
            var canvas = document.querySelector('canvas');
            var canvasStream = canvas.captureStream();
            var finalStream = new MediaStream();
            window.getTracks(audioStream, 'audio').forEach(function (track) {
                console.log("track : ",track)
                finalStream.addTrack(track);
            });
            window.getTracks(canvasStream, 'video').forEach(function (track) {
                console.log("canvastrack : ",track)
                finalStream.addTrack(track);
            });
            var recorder1 = RecordRTC(finalStream, {
                type: 'video'
            });
            // this.addReactFull()
            recorder1.startRecording();
           
            console.log(recorder1)
            var stop = false;
            console.log("record started")
            states.setState({
                recorder:recorder1,
                audioStream:audioStream,
                canvasStream:canvasStream
            })
        }).catch(err=>{
            console.log("error ouucres : ",err)
        })
    }  
 

    recordScreenStop(){
        var states = this;
        var recorder1 = this.state.recorder;
        var audioStream = this.state.audioStream;
        var canvasStream = this.state.canvasStream;
        recorder1.stopRecording(function() {
            var blob = recorder1.getBlob();
            // document.body.innerHTML = '<video controls src="' + URL.createObjectURL(blob) + '" autoplay loop></video>';
            states.videoTag.src =  URL.createObjectURL(blob)
            audioStream.stop();
            canvasStream.stop();
        });     
    }

    createDownloadLink(blob) {

        this.setState({
            downloadUrl: this.state.URL.createObjectURL(blob),
            blob: blob
        })
    }

    render() {
      
        var acceptBtn = null;
        var audioplayer = null
        var downLinkAudio = null;
        var timer = null;
     if(this.state.isAudioRecStarted){
         timer = ( <Countdown
            date={Date.now() + 180000}
            renderer={this.renderer}        
        />)
     }
        if (this.state.isAudioRecDone) {
            acceptBtn = (<div><button className="buttonLight btnsss" onClick={this.acceptRecording}>Accept</button>
                <button className="buttonLight btnsss" onClick={this.discardRecording} >Discard</button>
            </div>)
        }
        if (this.state.downloadUrl) {
            audioplayer = (<audio controls={true} src={this.state.downloadUrl} ></audio>)

            downLinkAudio = (<div>
                <a href={this.state.downloadUrl} download={this.state.fileName}>Download</a>
            </div>)
        }


        var recInfo = (<p>{this.state.isRecording}</p>)

        return (
            <div className="AudioComp">
            <div className="Controls">
            <div>
               {timer}
               </div>
               <div >
               <button className="buttonLight btnss" disabled={this.state.stopBtn} id="stopRec" onClick={this.stopRec} >stop</button>
                <button className="buttonLight btnss"disabled={this.state.startBtn} id="startRec" onClick={this.startRec} >record</button>
                </div>
                {acceptBtn}
                <div>
                    <p>{this.props.canvass}</p>
                {recInfo}
                </div>
                {downLinkAudio}
                </div>
                {audioplayer}



                {/* {RecordView} */}

                {/* <AudioRecorder /> */}
            </div>
        )
    }
}

export default Recoder 
