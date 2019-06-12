import React, { Component } from 'react'
import '../../css/call.css'
import Form from '../Form';
import { connect } from 'react-redux';
import Countdown from 'react-countdown-now';
import config from '../../../config/config'
import PropType from 'prop-types';
import {postStartCall} from '../../../actions/extensionAction'
import {increaseTimer} from '../../../actions/callAction'
import { showCanvas, hideCanvas } from '../../../actions/canvasAction';

class Call extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showCanvas: false,
            socket:null
        }
        this.toggleCanvas = this.toggleCanvas.bind(this);
        this.increaseTime = this.increaseTime.bind(this);
    }
    componentDidMount(){
        var self=this
        var socket = this.props.socket
        function postMessageHandler(event) {

           
            if(event.data.type===config.END_CALL_FROM_EXTENSION){
                console.log("peforming the endcall Action")
                self.props.endCall();
                socket.emit(config.END_CALL, {
                    'peerId': self.props.peerId,
                    'timerEnded': true,
                })
                return
            }
            if(event.data.type ===  config.ADD_EXTRA_MINUTE_TO_WEB_SITE){
                console.log("web page add extra")

                self.increaseTime()
                return
            }

            if(event.data.type === config.SHARE_MYSCREEN_FROM_EXTENSION){
                self.props.shareMyScreen();
                return
            }
        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }
    }
    componentWillUnmount(){
        var source = this.props.extSource
        var origin = this.props.extOrigin
        const endCall = {
            type:config.END_CALL_PEER_FROM_EXTNESION,
            data:{timer:this.props.timeAloted,
            profilePic:this.props.otherPersonPic}
        }
        if (this.props.extSource !== null) {
            source.postMessage(endCall, origin);
        }
        else{
            window.postMessage(endCall, "*")
        }
    }
    componentWillMount(){
        localStorage.setItem('action',JSON.stringify(config.FULL_SCREEN_SHARE))
        localStorage.setItem('timer',JSON.stringify(this.props.timeAloted))
        const {extOrigin,postStartCall,otherPersonPic,otherPersonProfileId,extSource,socket,timeAloted}  = this.props;
        postStartCall(config.FULL_SCREEN_SHARE,
            extOrigin,otherPersonPic,extSource,
            timeAloted,otherPersonProfileId)
        this.setState({ socket:socket })
    }
    increaseTime(){
        const self = this;
        this.props.increaseTimer();
        this.props.conn.send({
            data: "addtimer",
            timeAloted:JSON.stringify(self.props.timeAloted)
        })
        var source = this.props.extSource
        var origin = this.props.extOrigin
        this.setState({
            socket:this.props.socket
        })

        const addMinute = {
            'type':config.ADD_EXTRA_MIUTE_TO_EXTENSION,
            'data':{
                'currentTime':this.props.timeAloted,
              
            }
        }
        if (this.props.extSource !== null) {
            source.postMessage(addMinute, origin);
            return
        }
        else{
            window.postMessage(addMinute, '*');
            return
        }
    }
    toggleCanvas() {
        if (this.state.showCanvas)
            this.props.hideCanvas()
        else this.props.showCanvas()
        this.setState({
            showCanvas: !this.state.showCanvas
        })

    }
    render() {
        const messageOfScreenShare = (!this.props.myscreenSharing) ? (null) :
            (<h4><b>Your screen is being shared</b></h4>)

        const shouldDisplay = (!this.props.myscreenSharing) ? ("block") : ("none")

        var showCanv = (this.state.showCanvas) ? (
            <div className="canvToolDivCall">
                <Form onRef={ref => (this.child = ref)} />
                <p>Screen is being shared..</p>

            </div>
        ) : (<div className="callDetails">
            {messageOfScreenShare}
            {/* <button  className={this.props.buttonClassName} onClick={this.increaseTime}>Add 1 minute</button> */}

            <video srcobject={this.props.videoStream}
                id="secondShareVideo"
                autoPlay
                style={{ display: shouldDisplay }}
                width="100%"></video>

        </div>)
        return (
            <div className="callDiv">
                <div className="statusBarCall">
                    <div className="timerDiv">
                        <Countdown
                            date={Date.now() + this.props.timeAloted * 60 * 1000}
                            renderer={this.props.renderer}
                            />

                    </div>
                    <div>

                    </div>
                    <div>
                    </div>

                </div>
                {showCanv}
             </div>
        )
    }
}
Call.PropType = {
    showCanvas: PropType.func.isRequired,
    hideCanvas: PropType.func.isRequired,
    postStartCall:PropType.func.isRequired
};
const mapStateToProps = state => ({
    startSecodScreenShare: state.secondScreenShare.secondScreenShareStarted,
    secodShareStream: state.secondScreenShare.stream,
    buttonClassName:state.call.buttonClassName,
    timeAloted: state.call.noOfMinutes,
    extSource: state.extension.source,
    extOrigin: state.extension.origin,
})

export default connect(mapStateToProps, {postStartCall, showCanvas,increaseTimer, hideCanvas })(Call)



