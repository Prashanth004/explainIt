import React, { Component } from 'react'
import '../../css/call.css'
import Countdown from 'react-countdown-now';
import Form from '../Form'
import { connect } from 'react-redux';
import PropType from 'prop-types';
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
        const videoInfo = (this.props.startSecodScreenShare)?
        (<span style={{fontSize:"15px"}}>Below is the screen of other peer</span>):(null)

        console.log("calling file, other profileid : ", this.props.otherPersonProfileId)
        if (this.props.otherPersonProfileId !== null) {
            console.log("1")
            var ProfileHover = (<ProfileCard
                userId={this.props.otherPersonProfileId} />)
        }
        else {
            console.log("0")
            var ProfileHover = null
        }
        var showCanv = (this.state.showCanvas) ? (
            <div className="canvToolDivCall">
                <Form onRef={ref => (this.child = ref)} />
                <p>Screen is being shared..</p>

            </div>
        ) : (<div className="callDetails">
            <p><b>Screen is being shared..</b></p>
            {videoInfo}
            <video srcObject=" "
                id="secondShareVideo"
                style={{ display: "none" }}
                width="100%"
            ></video>

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
                        {/* <p onClick={this.toggleCanvas}>Canvas</p> */}
                    </div>

                </div>
                {showCanv}

                <div className="callImageDivAnwser">

                    <div className="callPage-recieverImageDiv">

                        {/* <MdCallEnd onClick={this.props.endCall} className="img__overlay"/> */}
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
                        <img className="callPage-recieverImage" src={this.props.otherPersonPic}></img>
                        {/* </span> */}
                    </div>

                    {/* <div className="callPage-recieverImageDiv endCall">
                        <span className="hint--top" aria-label="End Call">
                            <MdCallEnd  className="endButton" />
                        </span>
                        {/* <span style={{fontSize:"12px"}}>End Call</span> */}
                    {/* </div> */}
                </div>


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
    secodShareStream: state.secondScreenShare.stream

})

export default connect(mapStateToProps, { showCanvas, hideCanvas })(Call)



