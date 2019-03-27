import React, { Component } from 'react'
import '../../css/call.css'
import Countdown from 'react-countdown-now';
import Form from '../Form'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import {showCanvas, hideCanvas} from '../../../actions/canvasAction';
import {  MdCallEnd } from "react-icons/md";
class Call extends Component {
    constructor(props){
        super(props)
        this.state={
            showCanvas:false
        }
        this.toggleCanvas = this.toggleCanvas.bind(this)
    }
    toggleCanvas(){
        if(this.state.showCanvas)
            this.props.hideCanvas()
        else this.props.showCanvas()
        this.setState({
            showCanvas:!this.state.showCanvas
        })
        
    }
    render() {
        var showCanv = (this.state.showCanvas)?(
            <div className="canvToolDivCall">
            <Form onRef={ref => (this.child = ref)} />
            <p>Screen is being shared..</p>
            </div>
        ):(  <div className="callDetails">
        <p><b>Screen is being shared..</b></p>
        </div>)
        return (
            <div className="callDiv">
            <div className="statusBarCall">
                <div className="timerDiv">
                <Countdown
                    date={Date.now() +  this.props.timeAloted*60*1000}
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
                   
                    <MdCallEnd onClick={this.props.endCall} className="img__overlay"/>
                  
                        <img className="callPage-recieverImage"  src={this.props.otherPersonPic}></img>
                    </div>
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
   
   
})

export default connect(mapStateToProps, { showCanvas, hideCanvas })(Call)



