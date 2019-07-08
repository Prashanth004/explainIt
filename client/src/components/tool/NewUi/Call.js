import React, { Component } from 'react'
import '../../css/call.css'
import Form from '../Form';
import { connect } from 'react-redux';
import Countdown from 'react-countdown-now';
import config from '../../../config/config'
import PropType from 'prop-types';
import {postStartCall} from '../../../actions/extensionAction'
import {increaseTimer,deacreaseTimer} from '../../../actions/callAction'
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
        this.postMessageHandler = this.postMessageHandler.bind(this);
        this.deacreaseTimer = this.deacreaseTimer.bind(this);
    }
    postMessageHandler(event) {
        var self=this
        var socket = this.props.socket
           
        if(event.data.type===config.END_CALL_FROM_EXTENSION){
            console.log(" end call from extension recieved")
            self.props.endCall();
            socket.emit(config.END_CALL, {
                'peerId': self.props.peerId,
                'timerEnded': true,
            })
            return
        }
        if(event.data.type ===  config.ADD_EXTRA_MINUTE_TO_WEB_SITE){
            self.increaseTime()
            return
        }
        if(event.data.type === config.DECREASE_MINUTE_TO_WEB_SITE){
            self.deacreaseTimer()
            return
        }

        if(event.data.type === config.SHARE_MYSCREEN_FROM_EXTENSION){
            self.props.shareMyScreen();
            return
        }
    }
    componentDidMount(){
       

        if (window.addEventListener) {
            window.addEventListener("message", this.postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", this.postMessageHandler);
        }
    }
    componentWillUnmount(){
        window.removeEventListener("message",this.postMessageHandler)
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
    deacreaseTimer(){
        const self = this;
        this.props.deacreaseTimer();
        this.props.conn.send({
            data: "reduceTimer",
            timeAloted:JSON.stringify(self.props.timeAloted)
        })
        var source = this.props.extSource
        var origin = this.props.extOrigin
        this.setState({
            socket:this.props.socket
        })

        const addMinute = {
            'type':config.DECREASE_MIUTE_TO_EXTENSION,
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
        const {otherPersonName,topicOfTheCall,myscreenSharing} = this.props;
        const messageOfScreenShare = (!myscreenSharing) ? (null) :
            (
            <div><h4><b>Your screen is being shared to {otherPersonName}  </b></h4>
            <h5>Topic : {topicOfTheCall}</h5>
            </div>)

        const shouldDisplay = (!myscreenSharing) ? ("block") : ("none")

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
                        zeroPadTime={2}
                            date={Date.now() + this.props.timeAloted * 60 * 1000}
                            renderer={this.props.renderer}/>

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
    topicOfTheCall : state.call.topicOfTheCall
})

export default connect(mapStateToProps, {postStartCall,deacreaseTimer,showCanvas,increaseTimer, hideCanvas })(Call)



