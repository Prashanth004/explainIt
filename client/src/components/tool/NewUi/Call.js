import React, { Component } from 'react'
import '../../css/call.css'
import Countdown from 'react-countdown-now';
import Form from '../Form';
import { MdFilterNone } from "react-icons/md";
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import PropType from 'prop-types';
import {increaseTimer} from '../../../actions/callAction'
import { showCanvas, hideCanvas } from '../../../actions/canvasAction';
import { MdCallEnd } from "react-icons/md";
import ProfileCard from './ProfileHover'
class Call extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showCanvas: false
        }
        this.toggleCanvas = this.toggleCanvas.bind(this)
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
        var ProfileHover = null

        const messageOfScreenShare = (!this.props.myscreenSharing) ? (<h4><b>Screen of other peer</b></h4>) :
            (<h4><b>Your screen is being shared</b></h4>)

        const shouldDisplay = (!this.props.myscreenSharing) ? ("block") : ("none")
        if (this.props.otherPersonProfileId !== null) {
            ProfileHover = (<ProfileCard
                userId={this.props.otherPersonProfileId} />)
        }
        else {
            ProfileHover = null
        }
        var showCanv = (this.state.showCanvas) ? (
            <div className="canvToolDivCall">
                <Form onRef={ref => (this.child = ref)} />
                <p>Screen is being shared..</p>

            </div>
        ) : (<div className="callDetails">
            {messageOfScreenShare}
            <button  className={this.props.buttonClassName} onClick={this.props.increaseTimer}>Add 1 minute</button>

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

                    </div>
                    <div>

                    </div>
                    <div>
                        {/* <p onClick={this.toggleCanvas}>Canvas</p> */}
                    </div>

                </div>
                {showCanv}
                <Draggable>
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
                            <img alt="reciever profile pic" className="callPage-recieverImage" src={this.props.otherPersonPic}></img>
                            {/* </span> */}
                        </div>
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
                        </div>


                        {/* <div className="callPage-recieverImageDiv endCall">
                        <span className="hint--top" aria-label="End Call">
                            <MdCallEnd  className="endButton" />
                        </span>
                        {/* <span style={{fontSize:"12px"}}>End Call</span> */}
                        {/* </div> */}
                    </div>
                </Draggable>


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
})

export default connect(mapStateToProps, { showCanvas,increaseTimer, hideCanvas })(Call)



