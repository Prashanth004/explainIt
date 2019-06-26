import React, { Component } from 'react';
import config from '../../../../config/config';
import './record.css'

export default class componentName extends Component {
  constructor(props){
    super(props);
    this.state={
      diplayinfo:" "
    }
  }

  componentDidMount(){
    const self = this;
    function postMessageHandler(event) {
      if (event.data.type === config.UPDATE_INFO) {
        self.setState({diplayinfo : event.data.info})
      }
    }
    if (window.addEventListener) {
        window.addEventListener("message", postMessageHandler, false);
    } else {
        window.attachEvent("onmessage", postMessageHandler);
    }
  }
  render() {
    return (
      <div  className="infoConatinerFloat">
        <p style={{ fontWeight:"500"}}>{this.state.diplayinfo}</p>
      </div>
    )
  }
}

