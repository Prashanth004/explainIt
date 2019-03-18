import React, { Component } from 'react'
import config from '../../config/config'
import '../css/screenRecorder.css'
import '../css/shareScreen.css';
import { Redirect } from 'react-router-dom';
import { answerCall } from '../../actions/callAction'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import socketIOClient from "socket.io-client";
import { stillAuthenicated } from '../../actions/signinAction';
import { getProfileByTwitterHandle } from "../../actions/visitProfileAction";

class DisplayShare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            peer: null,
            host: config.peerHost,
            port: config.peerPort,
            path: config.peerPath,
            stream: null,
            peerIdFrmPeer:null,
            isConnPreasent: false,
            conn: null,
            socket: null,
            clientPeerid: null,
            stream: null,
            call: null,
            closedHere: false,
            showDisconectMessage: false,
            connected: false,
            peerProfilePic: null,
            callEnded: false,
            manualClose: false,
            isTokenValid: false,
            validCheckComplete: false
        }
        this.closeConnection = this.closeConnection.bind(this);
        this.endCall = this.endCall.bind(this);
    }
    closeWindow() {
        window.close();
    }

    componentDidMount() {
        var socket = this.state.socket;
        var peerIdFrmPeer = this.state.peerIdFrmPeer;
        var self = this;
        setTimeout(() => {
            if (!self.state.validCheckComplete) {
                self.setState({
                    validCheckComplete:true,
                    isTokenValid: false
                })
            }
        }, 4000)
        socket.emit(config.CHECK_TOKEN_CALIDITY, {
            'clientId': peerIdFrmPeer
        })
        socket.on(config.COMFIRM_TOKEN_VALIDITY, data => {
            if (data.success === 1) {
                self.setState({
                    validCheckComplete: true,
                    isTokenValid: true
                })
            }
        })
        socket.on(config.END_CALL, data => {
            console.log(" data from client ack : ", data)
            if (data.peerId === peerIdFrmPeer) {
                self.closeConnection()
                self.setState({
                    manualClose: true
                })
            }
        })
    }

    componentWillMount() {
        var peerIdFrmPeer = this.props.match.params.callerid
        const socket = socketIOClient(config.base_dir);
        this.setState({
            socket: socket,
            peerIdFrmPeer: peerIdFrmPeer
        });
        this.props.stillAuthenicated();
        var profilePic = (localStorage.getItem("profilePic"))
        this.setState({
            peerProfilePic: profilePic
        });
        this.props.answerCall()
        var peer = new window.Peer()
        var self = this
        this.setState({
            peer: peer
        });
        peer.on('open', function (id) {
            self.setState({
                clientPeerid: id
            })
        });
        console.log(" this.props.match.params.callerid : ", this.props.match.params.callerid)
        var self = this;
        var startConnection = new Promise((resolve, reject) => {
            var conn = peer.connect(peerIdFrmPeer);
            resolve(conn)
        });
        startConnection.then((conn) => {
            setTimeout(() => {
                conn.send({
                    clientId: self.state.clientPeerid
                });
            }, 5000)
        });
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        peer.on('call', function (call) {

            console.log("connection : ", call)
            getUserMedia({ audio: true }, function (audiostream) {
                call.answer(audiostream)
                call.on('stream', function (stream) {
                    socket.emit(config.CALL_ACK_MESSAGE, {
                        'clientId': self.state.clientPeerid
                    })
                    self.setState({
                        connected: true
                    })
                    console.log('Received', stream);
                    var divi = document.querySelector('.screenShareDiv')
                    divi.style.display = "block"
                    var video = document.querySelector('#video');
                    video.srcObject = stream
                    setTimeout(() => {
                        video.play()
                    }, 1000)
                });

                call.on('close', function () {
                    // console.log("close connection   ")
                    if(!self.state.callEnded){
                        self.closeConnection()
                    }
                   
                })
                self.setState({
                    stream: audiostream,
                    call: call
                })
            })
        })
        peer.on('close', () => {
           
            if(!self.state.callEnded){
                self.closeConnection()
            }
        })
        peer.on('disconnected', function() {
            if(!self.state.callEnded){
                self.closeConnection()
            }
         });
         peer.on('error', function(err) {
            if(!self.state.callEnded){
                self.closeConnection()
            }
          });
         peer.on('close', function() {
            if(!self.state.callEnded){
                self.closeConnection()
            }
         });
    }

    openLogin() {
        window.open(config.react_url + '/login')
    }
    endCall() {
        var call = this.state.call;
        this.setState({
            closedHere: true,
            manualClose:true
        })
        setTimeout(() => {
            call.close();
        }, 400)
        this.closeConnection()
        var socket = this.state.socket
        socket.emit(config.END_CALL, {
            'clientId': this.state.clientPeerid
        })
    }
    closeConnection() {
        if (!this.state.closedHere === true) {
            this.setState({
                showDisconectMessage: true
            })
        }
        this.setState({
            callEnded: true
        })
        var stream = this.state.stream
        if(stream!== null){
            stream.stop()
        }
        
    }

    render() {
        // var callAnim=(this.state.connected)?
        // (<CallImage action="notWaiting" recieverImageUrl={this.state.peerProfilePic} callerImageUrl={this.props.profilePic}/>)
        // :(<CallImage action="waiting" recieverImageUrl={this.state.peerProfilePic} callerImageUrl={this.props.profilePic}/>)
        var displayLoginMessage = (!!this.props.isLoggedIn) ? (<div><p></p></div>) :
            (<div><h1>Login in to explain to be able initiate screen shares</h1>
                <button onClick={this.openLogin} className="buttonDark btnGap">Login</button>
                <button onClick={this.closeWindow} className="buttonLight">No I am fine</button></div>)
        var displayMessage = (this.state.manualClose)?(
            (this.state.closedHere) ?
            (<h5>Call Ended</h5>) :
            (<h5>
                Disconnected from other peer
            </h5>)
        ):(
            (<h5>
                <b>Call ended due to network issues</b>
            </h5>)
        )
        if (!this.state.callEnded) {
            var ShareElement = (
                <div>
                    <video className="VideoElement" autoPlay={true} id="video" srcObject=" " ></video>
                    <div id="main-circle">
                        <div onClick={this.endCall} id="inner-circle">END</div>
                    </div>
                </div>
            )
        }
        else if (this.state.callEnded) {
            var ShareElement = (
                <div>
                    <div className="postCalltextDisplay">
                        {displayMessage}
                        {displayLoginMessage}
                    </div>
                </div>
            )
        }
        var precallActivity = (!this.state.connected) ? (<div> <h2>Coneecting..</h2>
            <p>Please wait</p>
        </div>) : (null)
        // return ((this.state.validCheckComplete) ? (
        //     (this.state.isTokenValid) ? 
           return (<div className="screenShareDiv">
                {ShareElement}
                <div className="callImageDiv">
                    {/* {callAnim} */}
                    {precallActivity}
                </div>
            </div>)
        //      : (<div  className="callImageDiv">
        //         <h2>The sharable lisk is expired</h2>
        //         <h3>Please check with the caller</h3>
        //     </div>)

        // ) : ((<div  className="callImageDiv">
        //     <h2>Testing tooken Validity...</h2>
        //     </div>)))
    }
}
DisplayShare.PropType = {
    answerCall: PropType.func.isRequired,
    stillAuthenicated: PropType.func.isRequired,
    getProfileByTwitterHandle: PropType.isRequired
}

const mapStateToProps = state => ({
    profilePic: state.auth.profilePic,
    peerProfilePic: state.visitProfile.profilePic,
    isLoggedIn: state.auth.isAuthenticated

})

export default connect(mapStateToProps, { answerCall, getProfileByTwitterHandle, stillAuthenicated })(DisplayShare)



