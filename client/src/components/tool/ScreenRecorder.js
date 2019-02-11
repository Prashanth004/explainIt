import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import RecordRTC from 'recordrtc'
import Dummy from './dummy'
import html2canvas from 'html2canvas'
import config from '../../config/config'

export class ScreenRecorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recorder: null,
            audioStream: null,
            canvasStream: null,
            downloadUrl: null,
            startBtn: false,
            stopBtn: true,
            isAudioRecStarted: false,
            isAudioRecDone: false,
            blob: null,
            finalStream: null,
            host: config.peerHost,
            port: config.peerPort,
            path: config.peerPath,
            conn: null,
            destkey: null,
            streamvideo: null,
            peer: null,
            peerId: null,
            connected: false
        }
        this.recordScreenStop = this.recordScreenStop.bind(this);
        this.recordScreenStart = this.recordScreenStart.bind(this);
        this.renderer = this.renderer.bind(this);
        this.stopScreenShare = this.stopScreenShare.bind(this);
        this.getMedia = this.getMedia.bind(this);
        this.handle_dest = this.handle_dest.bind(this);
        this.startScreenShareSend = this.startScreenShareSend.bind(this);
        this.generateLink = this.generateLink.bind(this)
    }

    getMedia() {
        var states = this
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
            states.setState({
                audioStream: audioStream,
                canvasStream: canvasStream,
                finalStream: finalStream
            })
        }).catch(err => {
            console.log("error ouucres : ", err)
        })
    }

    startScreenShareSend() {
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
            var peer = self.state.peer
            console.log("peer :", peer)
            console.log("destKey : ", self.state.destkey)
            console.log("finalStream : ", finalStream)
            var call = peer.call(self.state.destkey, finalStream);
            console.log("call : ", call)
            if (call) {
                call.on('stream', function (remoteStream) {
                    self.props.draRect();
                    console.log("call answer recieved : ", remoteStream)
                    var audio = document.querySelector('#video');
                    audio.srcObject = remoteStream
                    audio.play()
                    self.setState({
                        connected: true
                    })
                }, function (err) {
                    console.log('Failed to get local stream', err);
                });
            }
            self.setState({
                audioStream: audioStream,
                canvasStream: canvasStream,
                finalStream: finalStream
            })
        }).catch(err => {
            console.log("error ouucres : ", err)
        })
    }

    componentWillMount() {
        var self = this;
        var peer = new window.Peer()
        this.setState({
            peer: peer
        })
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            self.setState({
                peerId: id
            })
        });
        peer.on('connection', (conn) => {
            conn.on('open', () => {
                console.log("got some data")
                conn.on('data', (data) => {
                    console.log("data : ", data)
                    self.setState({
                        destkey: data.clientId
                    })
                    self.startScreenShareSend()
                });
            });
        });
        this.setState({
            peer: peer
        })
    }

    recordScreenStart() {
        this.getMedia()
        console.log(this.state.finalStream)
        var recorder1 = RecordRTC(this.state.finalStream, {
            type: 'video'
        });
        recorder1.startRecording();
        this.props.draRect();
        this.setState({
            isAudioRecStarted: true,
            startBtn: true,
            stopBtn: false,
            recorder: recorder1
        })
    }


    stopScreenShare() {

    }
    handle_dest(e) {
        this.setState({
            destkey: e.target.value
        })
    }

    renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            this.stopRec()
            return (<Dummy></Dummy>)

        } else {
            // Render a countdown
            return <span>{hours}:{minutes}:{seconds}</span>;
        }
    };

    generateLink() {
        var peerId = this.state.peerId;
        var shareScreenLink = config.react_url + '/connect/' + peerId;
        this.setState({
            shareScreenLink: shareScreenLink
        })
    }

    recordScreenStop() {
        var states = this;
        var recorder1 = this.state.recorder;
        var audioStream = this.state.audioStream;
        var canvasStream = this.state.canvasStream;
        if (recorder1) {
            recorder1.stopRecording(function () {
                var blob = recorder1.getBlob();
                states.setState({
                    downloadUrl: URL.createObjectURL(blob),
                    blob: blob
                })
                audioStream.stop();
                canvasStream.stop();
                states.props.assignAudioUrl(states.state.blob)
            });
        }
        else {
            alert("Some thign went wrong")
        }
        this.setState({
            startBtn: false,
            stopBtn: true,
            isAudioRecDone: true,
            isRecording: "",
            isAudioRecStarted: false,
            recorder: null,
            audioStream: null,
            canvasStream: null,
        })
    }

    render() {
        var timer = null;
        if (this.state.isAudioRecStarted) {
            timer = (<Countdown
                date={Date.now() + 180000}
                renderer={this.renderer}
            />)
        }
        var videoplayer = " ";
        var downLinkAudio = " ";
        var linkElement = " ";
        if (this.state.downloadUrl) {
            videoplayer = (<video src={this.state.downloadUrl} controls={true}></video>)

            downLinkAudio = (<div>
                <a href={this.state.downloadUrl} download="dmkmdvkmdkm">Download</a>
            </div>)
        }
        if (this.state.shareScreenLink) {
            linkElement = (<p>{this.state.shareScreenLink}</p>)
        }
        return (
            <div>
                <div>
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
                    {/* {downLinkAudio} */}
                </div>
            </div>
        )
    }
}

export default ScreenRecorder
