import React, { Component } from 'react';
import config from '../../../../config/config';
import './record.css'

export default class componentName extends Component {
  constructor(props){
    super(props);
    this.state={
      diplayinfo:" ",
      playAudio:false
    }
    this.audioTimer = this.audioTimer.bind(this);
  }
  audioTimer(){}
  componentDidMount(){
    const self = this;
    function postMessageHandler(event) {
      if (event.data.type === config.UPDATE_INFO) {
        self.setState({diplayinfo : event.data.info})
      }
      if (event.data.type === config.INCOMING_CALL_AUDIO_PLAY) {
        clearTimeout(this.audioTimer)
        console.log("GOT the info to floater")
        self.setState({playAudio : true})
        this.audioTimer = setTimeout(()=>{
          if(self.state.playAudio === true){
            self.setState({playAudio : false})
          }
        },18000)
      }
      if(event.data.type === config.INCOMING_CALL_AUDIO_STOP){
        self.setState({playAudio : false})
      }
       
    }
    if (window.addEventListener) {
        window.addEventListener("message", postMessageHandler, false);
    } else {
        window.attachEvent("onmessage", postMessageHandler);
    }
  }
  componentWillUnmount(){
    clearTimeout(this.audioTimer);
  }
  render() {
    const audoEle = (this.state.playAudio)?( <audio style={{ display: "none" }} autoPlay loop src={require('../../../audio/simple_beep.mp3')}></audio>):(null)
    return (
      <div  className="infoConatinerFloat">
        <p style={{ fontWeight:"500"}}>{this.state.diplayinfo}</p>
        {audoEle}
      </div>
    )
  }
}

