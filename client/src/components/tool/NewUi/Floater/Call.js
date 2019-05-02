import React, { Component } from 'react'
import '../../../css/call.css'
import Form from '../../Form';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { showCanvas, hideCanvas } from '../../../../actions/canvasAction';
import ProfileCard from '../ProfileHover'
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
        const messageOfScreenShare =(!this.props.myscreenSharing)?(<h4><b>Screen of other peer</b></h4>):
        (<h4><b>Your screen is being shared</b></h4>)
       
        const shouldDisplay=(!this.props.myscreenSharing)?("block"):("none")
        

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
            
            <video controls srcObject={Object(this.props.videoStream)}
        id="secondShareVideo"
        autoPlay
        style={{ display:shouldDisplay}}
       
        width="100%"
    ></video>

        </div>)
        return (
            <div className="callDiv">
                <div className="statusBarCall">
                    <div className="timerDiv">
                       
                    </div>
                    <div>

                    </div>
                    <div>
                        {/* <p onClick={this.toggleCanvas}>Canvas</p> */}
                    </div>

                </div>
                {showCanv}



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



