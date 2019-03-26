import React, { Component } from 'react'
import config from '../../config/config'
import '../css/screenRecorder.css'
import '../css/shareScreen.css';
import '../css/call.css'
import { Redirect } from 'react-router-dom';
import { answerCall } from '../../actions/callAction'
import { connect } from 'react-redux';
import { MdCallEnd } from "react-icons/md";
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
            peerIdFrmPeer: null,
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
            validCheckComplete: false,
            picture: null,
            twitterhandle: null,
            timerEnded: false
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
                    validCheckComplete: true,
                    isTokenValid: false
                })
            }
        }, 4000)
        socket.emit(config.CHECK_TOKEN_VALIDITY, {
            'clientId': peerIdFrmPeer
        })

        socket.on(config.CLOSE_NETWORK_ISSUE, data => {
            if (data.otherPeerId === self.state.peerIdFrmPeer) {
                self.closeConnection()
            }
        })

        socket.on(config.RETRYCALL, data => {

            if (data.peerId === self.state.peerIdFrmPeer) {
                self.peerConnections(socket)
                self.setState({
                    callEnded: false
                })
            }
        })
        socket.on(config.COMFIRM_TOKEN_VALIDITY, data => {
            // alert("success")
            if (data.success === 1) {
                self.setState({
                    validCheckComplete: true,
                    isTokenValid: true,
                    picture: data.profilePic,
                    twitterhandle: data.twitterHandle
                })
            }
        })
        socket.on(config.END_CALL, data => {
            console.log(" data from client ack : ", data)
            if (data.peerId === peerIdFrmPeer && data.timerEnded) {
                self.closeConnection()
                self.setState({
                    timerEnded: true
                })
            }
            else if (data.peerId === peerIdFrmPeer && !data.timerEnded) {
                self.closeConnection()
                self.setState({
                    manualClose: true
                })
            }
            socket.emit(config.ENDCALL_ACK, {
                'clientId': self.state.clientPeerid,
                'encCallAck': true
            })

        })
    }

    componentWillMount() {
        const socket = socketIOClient(config.base_dir);
        this.setState({
            socket: socket
        })
        this.peerConnections(socket);
    }

    peerConnections(socket) {
        var peerIdFrmPeer = this.props.match.params.callerid

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
                clientPeerid: id,
                connected: true
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
                console.log("sending the data please wait")
                conn.send({
                    clientId: self.state.clientPeerid,

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
                        connected: false
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
                    if (!self.state.callEnded) {
                        self.closeConnection()
                    }
                    socket.emit(config.CLOSE_NETWORK_ISSUE, {
                        'otherPeerId': self.state.clientPeerid
                    })

                })
                self.setState({
                    stream: audiostream,
                    call: call
                })
            })
        })
        peer.on('close', () => {

            if (!self.state.callEnded) {
                self.closeConnection()
            }
            socket.emit(config.ENDCALL_ACK, {
                'clientId': self.state.clientPeerid,
                'encCallAck': true
            })
        })
        peer.on('disconnected', function () {
            if (!self.state.callEnded) {
                self.closeConnection()
            }
            socket.emit(config.ENDCALL_ACK, {
                'clientId': self.state.clientPeerid,
                'encCallAck': true
            })
        });

    }

    openLogin() {
        window.open(config.react_url + '/login')
    }
    endCall() {
        var call = this.state.call;
        this.setState({
            closedHere: true,
            manualClose: true
        })
        setTimeout(() => {
            call.close();
        }, 400)

        var socket = this.state.socket
        socket.emit(config.END_CALL, {
            'clientId': this.state.clientPeerid
        })
        this.closeConnection()
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
        if (stream !== null) {
            stream.stop()
        }

    }

    render() {
        var profileUrl = config.react_url + '/profile/' + this.state.twitterhandle

        // var callAnim=(this.state.connected)?
        // (<CallImage action="notWaiting" recieverImageUrl={this.state.peerProfilePic} callerImageUrl={this.props.profilePic}/>)
        // :(<CallImage action="waiting" recieverImageUrl={this.state.peerProfilePic} callerImageUrl={this.props.profilePic}/>)
        var displayLoginMessage = (!!this.props.isLoggedIn) ? (<div><p></p></div>) :
            (<div><p><b>Login in to explain to be able initiate screen shares</b></p>
                <button onClick={this.openLogin} className="buttonDark btnGap">Login</button>
                <button onClick={this.closeWindow} className="buttonLight">No I am fine</button></div>)
        var displayMessage = (this.state.manualClose) ? (
            (this.state.closedHere) ?
                (<div>
                    <h5>Call Ended</h5>
                    <p>You can view this call in caller's profile created section</p>
                    <p>URL to access prfoile is <a href={profileUrl}>{profileUrl}</a></p>
                </div>) :
                (<h5>
                    Disconnected from other peer
                    <p>You can view this call in caller's profile created section</p>
                    <p>URL to access prfoile is <a href={profileUrl}>{profileUrl}</a></p>
                </h5>)
        ) : (
                ((this.state.timerEnded) ? (
                    <div>
                        <h3>Call ended as the time exceeded 3 minutes</h3>
                        <p>You can expect another link from the caller to continue the conversation</p>
                    </div>
                ) : (<div><h5>
                    <b>Call ended due to network issues</b>
                </h5>
                    <p>Please wait.. Caller will retry to call you </p>
                </div>))
            )
        if (!this.state.callEnded) {
            var ShareElement = (
                <div className="shareVideoDisplay">
                    <div className="videoContainer">
                        <video className="VideoElementReciever" autoPlay={true} id="video" srcObject=" " ></video>
                    </div>
                    <div className="decreasePadding">
                        <div className="callPage-recieverImageDiv">

                            <MdCallEnd onClick={this.endCall} className="img__overlay" />

                            <img className="callPage-recieverImage" src={this.state.picture}></img>
                        </div>

                        {/* <div class="overlayEndCall">
                        {/* <div class="text">Hello World</div> */}
                        {/* </div>  */}
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
        else {
            var ShareElement = (
                <div>
                    <div className="postCalltextDisplay">
                        <h4>Connecting..</h4>
                        <h5>Please wait</h5>
                    </div>
                </div>
            )
        }
        var precallActivity = (this.state.connected) ? (<div className="initialMessage">
            <h2>Connecting..</h2>
            <p>Please wait</p>
            <div className="callPage-recieverImageDiv">
                <img className="callPage-recieverImage wait" src={this.state.picture}></img>
            </div>
        </div>) : (null)
        return ((this.state.validCheckComplete) ? (
            (this.state.isTokenValid) ?
                (<div>

                    {precallActivity}
                    <div className="screenShareDiv">
                        {ShareElement}
                        <div className="callImageDiv">
                            {/* {callAnim} */}

                        </div>
                    </div>
                </div>)
                : (<div className="callImageDiv">
                    <h2>The sharable link is expired</h2>
                    <h3>Please check with the caller</h3>
                </div>)

        ) : ((<div className="callImageDiv">
            <h2>Testing Link Validity...</h2>
        </div>)))
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



