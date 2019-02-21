import React, { Component } from 'react'
// import 'webrtc-screen-capturing'

export default class componentName extends Component {
    constructor(props) {
        super(props)
        this.state = {
            source: null,
            origin: null,
            gotmessage: false,
            sourceId: null,
            peerId: null,
            peer: null,
            destkey: null
        }
        this.receiveMessage = this.receiveMessage.bind(this);
        this.generateLink = this.generateLink.bind(this);
        this.startScreenShareSend = this.startScreenShareSend.bind(this)
    }
    componentWillMount() {
        // var self = this;
        // var peer = new window.Peer()
        // this.setState({
        //     peer: peer
        // })
        // peer.on('open', (id) => {
        //     console.log('My peer ID is: ' + id);
        //     self.setState({
        //         peerId: id
        //     })
        //     self.generateLink()
        // });
        // peer.on('connection', (conn) => {
        //     conn.on('open', () => {

        //         console.log("got some data")
        //         conn.on('data', (data) => {
        //             console.log("data : ", data)

        //             self.setState({
        //                 destkey: data.clientId,
        //             })
        //             self.startScreenShareSend()
        //         });
        //     });
        // });
    }
    startScreenShareSend() {
        var self = this;
        console.log("reached sharing function")
        var isExecuted = false;
       
                isExecuted = true
                console.log("isExecuted becaome true")
                var sourceId = this.state.sourceId;
                console.log("sourceId : ",sourceId)
                var constraints = { 
                    video: {
                        mandatory: {
                          chromeMediaSource: 'desktop',
                          maxWidth: 1720,
                          maxHeight: 450,
                          maxFrameRate: 100,
                          minAspectRatio:1.75,
                          chromeMediaSourceId: sourceId         
                        }
                    }};
                console.log("constrain set")
                navigator.mediaDevices.getUserMedia({ audio: true }).then(function (audioStream) {

                navigator.mediaDevices.getUserMedia(constraints).then(function (screenStream) {

                    var finalStream = new MediaStream();
                    window.getTracks(audioStream, 'audio').forEach(function (track) {
                        finalStream.addTrack(track);
                    });
                    window.getTracks(screenStream, 'video').forEach(function (track) {
                        finalStream.addTrack(track);
                    });
                    var video = document.querySelector('#video');
                    console.log(" screenStream : ",finalStream);
                    video.srcObject = finalStream
                    // var peer = self.state.peer
                    // var call = peer.call(self.state.destkey, screenStream);
                }).catch((error)=>{
                    console.log("error: ",error)
                })
            })
            
        
    }
    generateLink() {
        var peerId = this.state.peerId;
        // var shareScreenLink = config.react_url + '/connect/' + peerId;
        // this.setState({
        //     shareScreenLink: shareScreenLink
        // })
    }
    componentDidMount() {
        console.log("asnckjadbskbsjfihb")
        var self = this
        // window.postMessage("world", '*');
        function postMessageHandler(event) {

            if (event.data.sourceId !== undefined) {
                console.log("We've got a message!");
                console.log("* Message:", event.data);
                console.log("* Origin:", event.origin);
                console.log("* Source:", event.source);
                console.log("*event.data.message : ", event.data.sourceId)
                self.setState({
                    sourceId: event.data.sourceId
                })
            }
            if (event.data === 'rtcmulticonnection-extension-loaded') {
                self.setState({
                    source: event.source,
                    origin: event.origin,
                    gotmessage: true
                })
            }
        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }
    }
    receiveMessage() {
        var source = this.state.source
        var origin = this.state.ori
        if (this.state.gotmessage) {
            source.postMessage('audio-plus-tab', origin);
        }
    }
    render() {
        console.log("render source id : ",this.state.sourceId)
        if(this.state.sourceId!==null){
            console.log("render source id calling function : ",this.state.sourceId)
            this.startScreenShareSend()
        }
        // var self = this
        // window.postMessage("world", '*');





        return (
            <div>
                <p>{this.state.sourceId}</p>
                <button onClick={this.receiveMessage}>recieve</button>
                <video src={this.state.downloadUrl} srcObject=" " id="video"controls={true}></video>

            </div>
        )
    }
}
