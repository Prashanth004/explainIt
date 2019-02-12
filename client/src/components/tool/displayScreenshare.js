import React, { Component } from 'react'
import config from '../../config/config'
import '../css/screenRecorder.css'

export default class DisplayShare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            peer: null,
            host: config.peerHost,
            port: config.peerPort,
            path: config.peerPath,
            stream: null,
            isConnPreasent: false,
            conn:null,
            clientPeerid:null
        }
    }
    componentWillMount() {
        var peer = new window.Peer()
        var self = this
        this.setState({
            peer: peer
        })
        peer.on('open', function (id) {
            self.setState({
                clientPeerid: id
            })
        });
        console.log(" this.props.match.params.callerid : ",this.props.match.params.callerid)
        var self = this;
        var startConnection = new Promise((resolve, reject)=>{
            var conn = peer.connect(self.props.match.params.callerid);
            resolve(conn)
        })
        startConnection.then((conn)=>{
            setTimeout(()=>{
                conn.send({
                    clientId:self.state.clientPeerid
                });
            },2000)
        })
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        peer.on('call', function (call) {
            console.log("connection : ",call) 
            getUserMedia({ audio: true}, function(stream) {
                call.answer(stream)
                call.on('stream', function(stream){
                    console.log('Received', stream);
                    var video = document.querySelector('#video');
                    video.srcObject  = stream
                    setTimeout(()=>{
                        video.play()
                    },1000)
        });
    })
  })
   }

    render() {
        return (
            <div className="screenShareDiv">
                <video className="VideoElement" autoplay ={true}id="video" srcObject=" " ></video>
            </div>
        )
    }
}
