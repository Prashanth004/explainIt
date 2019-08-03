
import { MdCallEnd, MdCall } from "react-icons/md";
import { connect } from 'react-redux';
import config from '../../../../config/config';
import React, { Component } from 'react';
import { answerCall, missCall,endCallfromOtherPeer } from '../../../../actions/callAction';
import { acceptCallDetails } from '../../../../actions/callAction';


class CallNotification extends Component {
    constructor(props) {
        super(props);
        this.answerCall = this.answerCall.bind(this);
        this.rejectCall = this.rejectCall.bind(this);
    }
    componentDidMount() {
        var socket = this.props.socket;
        const {endCallfromOtherPeer,userId,missCall,
            answerCall,acceptCallDetails}=this.props;
        if(socket!==null){
            socket.on(config.REJECT_REPLY, data => {
                if (userId === String(data.fromUserId)) 
                    answerCall();
            })
            socket.on(config.ACCEPT_SHARE_REQUEST, data => {
                if (userId === String(data.fromUserId)) 
                    answerCall();
            });
            socket.on(config.LINK_TO_CALL, data => {
                console.log("recieving the call")
                setTimeout(() => {
                    missCall();
                }, 18000)
                localStorage.setItem("profilePic", data.fromProfilePic)
                if (String(data.ToUserId) === userId) {
                    socket.emit(config.LINK_TO_CALL_ACK, {
                        "fromUserId": data.fromUserId,
                        "toUserId": data.toUserId
                    })
                    acceptCallDetails(
                        data.link,
                        data.fromEmail,
                        data.fromUserName,
                        data.fromUserId,
                        data.fromProfilePic,
                        data.topicOfTheCall,
                        data.timeAloted
                    )
                }
            });
            socket.on(config.END_WHILE_DIALING, data => {
                if (data.ToUserId === userId) {
                   endCallfromOtherPeer()
                }
            })
            socket.on(config.ENDING_RING, data => {
                if (data.ToUserId === userId) {
                    socket.emit(config.ENDING_RING_ACK, {
                        "ToUserId": data.fromUserId
                    })
                }
            })
        }


    }
    answerCall = () => {
        window.open(this.props.callActionLink, '_self');
        this.props.answerCall();
        var socket = this.props.socket;

        socket.emit(config.ACCEPT_SHARE_REQUEST, {
            'fromUserId': this.props.userId,
            'toUserId': this.props.callerId,
            'message': config.REPLY_TO_SHARE_REQ
        })
    }
    rejectCall = () => {
        var socket = this.props.socket
        socket.emit(config.REJECT_REPLY, {
            'fromUserId': this.props.userId,
            'toUserId': this.props.callerId,
            'message': config.REPLY_TO_SHARE_REQ
        })
        this.props.answerCall();
    }
    render() {
        return (this.props.incommingCall && !this.props.endedCallFromOtherPeer) ? (
            <div className="callNotification">
                <div>
                    <div className="CallCard">
                        <div>
                            <div className="callerProfileImage">
                                <img alt="caller profile Pic" className="callerProfileImageElement" src={this.props.callerProfilePic} />
                            </div>
                            <br />
                            {/* <audio style={{ display: "none" }} autoPlay loop src={require('../../../audio/simple_beep.mp3')}></audio> */}
                        </div>
                        <div style={{ padding: "15px", textAlign: "left", paddingTop: "5px" }}>
                            <p><b>{this.props.callerName} </b>is trying to share screen with you for <b>{this.props.timeAllotedRecieve}</b> minutes on topic <b>{this.props.topicOfTheCallRecieve}</b></p>
                        </div>
                    </div>

                    <div className="acceptRejectDiv">
                        <span className="hint--top" aria-label="Accept Request">
                            <div onClick={this.answerCall} className="acceptCall">
                                <MdCall />
                            </div>
                        </span>
                        <span className="hint--top" aria-label="Ask to send recording">
                            <div onClick={this.rejectCall} className="acceptCall reject">
                                <MdCallEnd />
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        ) : (null)
    }
}

const mapStateToProps = state => ({
    callActionLink: state.call.link,
    incommingCall: state.call.incommingCall,
    callerProfilePic: state.call.profilePic,
    callerName: state.call.userName,
    userId: state.auth.id,
    callerId: state.call.id,
    endedCallFromOtherEnd:state.call.endedCallFromOtherEnd,
    socket:state.home.socket
})
export default connect(mapStateToProps, {answerCall,acceptCallDetails,endCallfromOtherPeer,
     missCall})(CallNotification)



