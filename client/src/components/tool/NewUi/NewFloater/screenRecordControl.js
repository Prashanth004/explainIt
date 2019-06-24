import { MdStop } from "react-icons/md";
import Countdown from 'react-countdown-now';
import './record.css';
import config from '../../../../config/config'
import { connect } from 'react-redux';
import { FiPlay, FiPause} from "react-icons/fi";
import {pauseRecording,resumeRecording} from '../../../../actions/recoderAction'
import React, { Component } from 'react'
import {pauseRecorderFromFloater,resumeRecorderFromFloater} from '../../../../actions/extensionAction'

class RecordFloater extends Component {
    constructor(props){
        super(props)
        this.state={
            callTabid : null ,
            timer:config.RECORD_TIME
        }
        this.pauseRecorder =this.pauseRecorder.bind(this);
        this.renderer = this.renderer.bind(this);
        this.endCallFloater = this.endCallFloater.bind(this);
        
    }
componentWillMount(){
    this.props.updateTime()
      
}
endCallFloater(){
    var msg = null
    msg = {
        'type': config.END_RECORD_FROM_FLOATER,
        'data': {
           
        }
    };
  window.parent.postMessage(msg, "*");
  
  }
 

    renderer({ hours, minutes, seconds, completed }){
    
        if(this.props.pauseState){
            if((minutes + (seconds / 60)) ===0.1)
                this.props.updateTime();
            var currentTime = JSON.parse(localStorage.getItem('curTime'));
            return <span>{currentTime.hours}:{currentTime.minutes}:{currentTime.seconds}</span>;
        }
       
  if (completed) {
      return (null)
  } else {
      return <span>{hours}:{minutes}:{seconds}</span>;
  }
}
pauseRecorder(){
    const {resumeRecording,pauseState,pauseRecorderFromFloater,resumeRecorderFromFloater,pauseRecording} =this.props;
    const {callTabid} =this.state
    if(!pauseState){
        pauseRecording(null);
        pauseRecorderFromFloater(callTabid);
      localStorage.setItem('pauseState', JSON.stringify(config.PAUSED_RECORDER))
      
    }
    else{
        resumeRecording(null);
        resumeRecorderFromFloater(callTabid)
        localStorage.setItem('pauseState', JSON.stringify(config.RESUMED_RECORDER))
        var currentTime = JSON.parse(localStorage.getItem('curTime'));
        var time = (currentTime.minutes + (currentTime.seconds / 60));
       this.setState({timer:time}) 
    }
}
  render() {
  const {pauseState} = this.props;

  const pausePlay = (pauseState)?
  (<span className="hint--right" aria-label="Resume recording">
  <FiPlay onClick={()=>this.pauseRecorder(null)} className="endButton" />
  </span>):
  (<span className="hint--right" aria-label="Pause recording">
  <FiPause onClick={()=>this.pauseRecorder(null)} className="endButton" />
  </span>);

    return (<div>
        <div className="floaterContainerTans">
                 <div className="callImageDivAnwserMain Share record">
 
                     {/* <div className="callPage-recieverImageDiv">
                         <span>
                             <MdCallEnd
                                 className="img__overlayFloat"
                                 onClick={this.endCallFloater}
                                 style={{
                                     padding: "10px"
                                 }} />
                         </span>
                     </div> */}
                       <div  className="callPage-recieverImageDiv endCall recordIcon">
                       <span className="hint--right" aria-label="Stop recording">
  <MdStop  onClick={this.endCallFloater} className="endButton" />
  </span>
 
                     </div>
                     <div  className="callPage-recieverImageDiv endCall recordIcon">
                   {pausePlay}
 
                     </div>
                     <div fontSize="13px" style={{ color: "white" , marginTop:"10px"}}>
                         <Countdown
                             date={Date.now() + this.props.timer * 60 * 1000}
                             renderer={this.renderer}
                         />
                     </div>
 
                 </div>
             </div>
       
     </div>)
  }
  }


const mapStateToProps = state => ({
    pauseState:state.recorder.pauseState,
})

export default connect(mapStateToProps, {pauseRecording,resumeRecorderFromFloater,pauseRecorderFromFloater, resumeRecording})(RecordFloater)










