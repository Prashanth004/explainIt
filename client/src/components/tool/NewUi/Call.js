import React, { Component } from 'react'
import '../../css/call.css'
import Form from '../Form';
import { connect } from 'react-redux';
import Countdown from 'react-countdown-now';
import config from '../../../config/config'
import PropType from 'prop-types';
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
    // 'type': config.END_CALL_FROM_EXTENSION,
    componentDidMount(){
        var self=this
        var socket = this.props.socket
        function postMessageHandler(event) {
            if(event.data.type===config.END_CALL_FROM_EXTENSION){
                self.props.endCall();
                socket.emit(config.END_CALL, {
                    'peerId': self.props.peerId,
                    'timerEnded': true,
                })
            }
            if(event.data.type === config.SHARE_MYSCREEN_FROM_EXTENSION){
                self.props.shareMyScreen();
            }
        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }
    }
    componentWillMount(){
        var source = this.props.extSource
        var origin = this.props.extOrigin
        this.setState({
            socket:this.props.socket
        })
        const callStart = {
            type:config.START_CALL,
            data:{timer:this.props.timeAloted,
            profilePic:this.props.otherPersonPic,
            action:config.FULL_SCREEN_SHARE}
        }
        if (this.props.extSource !== null) {
            source.postMessage(callStart, origin);
        }
    }
    increaseTime(){
        this.props.increaseTimer();
        var source = this.props.extSource
        var origin = this.props.extOrigin
        this.setState({
            socket:this.props.socket
        })

        const addMinute = {
            'type':config.ADD_EXTRA_MIUTE_TO_EXTENSION,
            'data':{
                'currentTime':this.props.timeAloted
            }
        }
        if (this.props.extSource !== null) {
            source.postMessage(addMinute, origin);
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
        const messageOfScreenShare = (!this.props.myscreenSharing) ? (<h4><b>Screen of other peer</b></h4>) :
            (<h4><b>Your screen is being shared</b></h4>)

        const shouldDisplay = (!this.props.myscreenSharing) ? ("block") : ("none")

        var showCanv = (this.state.showCanvas) ? (
            <div className="canvToolDivCall">
                <Form onRef={ref => (this.child = ref)} />
                <p>Screen is being shared..</p>

            </div>
        ) : (<div className="callDetails">
            {messageOfScreenShare}
            <button  className={this.props.buttonClassName} onClick={this.increaseTime}>Add 1 minute</button>

            <video srcObject={Object(this.props.videoStream)}
                id="secondShareVideo"
                autoPlay
                style={{ display: shouldDisplay }}

                width="100%"
            ></video>

        </div>)
        return (
            <div className="callDiv">
                <div className="statusBarCall">
                    <div className="timerDiv">
                    {/* {audioWarning} */}
                        <Countdown
                            date={Date.now() + this.props.timeAloted * 60 * 1000}
                            renderer={this.props.renderer}
                            />

                    </div>
                    <div>

                    </div>
                    <div>
                        {/* <p onClick={this.toggleCanvas}>Canvas</p> */}
                    </div>

                </div>
                {showCanv}
                {/* <Draggable>
                    <div className="callImageDivAnwserMain">

                        <div className="callPage-recieverImageDiv">
                            <span>
                                <MdCallEnd
                                    onClick={this.props.endCall}
                                    className="img__overlay"
                                    style={{
                                        padding: "10px"
                                    }} />
                            </span>
                            <span className="tooltiptext" >
                                <div>
                                    {ProfileHover}

                                </div></span>

                            {/* <span className="hint--top" aria-label={this.props.otherPersonName}> */}
                            {/* <img alt="reciever profile pic" className="callPage-recieverImage" src={this.props.otherPersonPic}></img>
                            {/* </span> */}
                        {/* </div>
                        <div   style={{ display: shouldDisplay }} className="callPage-recieverImageDiv endCall">
                            <span className="hint--top" aria-label="Share my screen">
                                <MdFilterNone onClick={this.props.shareMyScreen} className="endButton" />
                            </span>
                        </div>
                        <div fontSize="13px" style={{ color: "white" }}>
                            <Countdown

                                date={Date.now() + this.props.timeAloted * 60 * 1000}
                                renderer={this.props.renderer}
                            />
                        </div> */} 


                        {/* <div className="callPage-recieverImageDiv endCall">
                        <span className="hint--top" aria-label="End Call">
                            <MdCallEnd  className="endButton" />
                        </span>
                        {/* <span style={{fontSize:"12px"}}>End Call</span> */}
                        {/* </div> */}
                    {/* </div>
                </Draggable> */} 


            </div>
        )
    }
}
Call.PropType = {
    showCanvas: PropType.func.isRequired,
    hideCanvas: PropType.func.isRequired
};
const mapStateToProps = state => ({
    startSecodScreenShare: state.secondScreenShare.secondScreenShareStarted,
    secodShareStream: state.secondScreenShare.stream,
    buttonClassName:state.call.buttonClassName,
    timeAloted: state.call.noOfMinutes,
    extSource: state.extension.source,
    extOrigin: state.extension.origin,
    // currentTimeLeft:state.call.currentTimeLeft,

})

export default connect(mapStateToProps, { showCanvas,increaseTimer, hideCanvas })(Call)



